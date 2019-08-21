import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from "joi";
import getUserId from '../../../utils/getUserId'
import checkRefreshToken from "../../../utils/checkRefreshToken";
import generateToken from '../../../utils/generateToken'
import hashPassword from '../../../utils/hashPassword'
import sendMail from '../../../utils/mailler/sendMail';
import resetPasswordTemplate from '../../../utils/mailler/templates/resetPasswordTemplate';
import resetPasswordTemplateMobile from '../../../utils/mailler/templates/resetPasswordTemplateMobile';
import passwordChangedSuccessful from '../../../utils/mailler/templates/passwordChangedSuccessful';
import { SignUpValidator, UpdateUserValidator, ResetPasswordValidator, OTPValidator } from '../../../validations';


const UserMutations = {
  async refreshToken(parent, args, { request }, info) {
    const userId = checkRefreshToken(request);
    if (!userId) {
      throw new Error("In valid token")
    }
    return generateToken(userId);
  },
  async createUser(parent, { data }, { prisma, request }, info) {
    // Validate Input
    await Joi.validate(data, SignUpValidator, { abortEarly: false });

    const emailExist = await prisma.query.user({
      where: { email: data.email }
    });

    if (emailExist) {
      return {
        error: {
          field: "email",
          message: "Email is already taken"
        }
      }
    }

    const phoneExist = await prisma.query.user({
      where: { phone: data.phone }
    });

    if (phoneExist) {
      return {
        error: {
          field: "phone",
          message: "Phone number already exist"
        }
      }
    }

    const password = await hashPassword(data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password,
        role: {
          connect: {
            id: data.role
          }
        }
      }
    });

    // Email Template
    const message = `
        <p>Hi, ${user.firstName + ' ' + user.lastName}. 
        Thanks you for signing up, on officeadmin. Click <a href="#">here</a> to verify your account.</p>
      `
    const template = passwordChangedSuccessful(user.email, message);

    // Do send mail
    sendMail(template);

    // Set User Session this is important for server side rendering applications
    request.response.req.session.userId = user.id;

    return {
      payload: {
        user,
        token: generateToken(user.id)
      }
    }
  },
  async login(parent, { data: { password, email } }, { prisma, request }, info) {
    const user = await prisma.query.user({
      where: { email }
    });

    if (!user) {
      return {
        error: {
          field: "email",
          message: "Invalid email"
        }
      }

    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return {
        error: {
          field: "password",
          message: "Incorrect password"
        }
      }
    }

    // Set User Session this is important for server side applications
    request.response.req.session.userId = user.id;

    return {
      payload: {
        user,
        token: generateToken(user.id)
      }
    }
  },
  async deleteUser(parent, { id }, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    const user = await prisma.mutation.deleteUser({
      where: { id }
    });

    return { user };

  },
  async deleteMyAccount(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    const id = getUserId(request);

    const user = await prisma.mutation.deleteUser({
      where: { id }
    });

    return { user };

  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    // Check that user must be logged in
    const userId = getUserId(request)

    if (!userId) {
      return {
        error: {
          field: "email",
          message: "User not found"
        }
      }
    }

    // Validate Input
    // await Joi.validate(data, UpdateUserValidator, { abortEarly: false });

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }

    const user = await prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data
    })

    return { user };
  },
  async forgotPassword(parent, { data: { platform, email } }, { prisma }, info) {

    const user = await prisma.query.user({
      where: {
        email
      }
    });

    if (!user) {
      return {
        error: {
          field: "email",
          message: "Email does not exist"
        }
      }
    }

    let token;
    let template;
    // Check if the platform is mobile and send OTP
    // Else send reset password link
    if (platform) {
      token = Math.floor(10000 + Math.random() * 90000).toString();
      // Email Template type
      template = resetPasswordTemplateMobile(user, token);
    } else {
      token = generateToken(user.id);
      // Email Template type
      template = resetPasswordTemplate(user, token);
    }

    await prisma.mutation.updateUser({
      where: {
        email
      },
      data: {
        resetToken: token,
        resetTokenExpiration: (Date.now() + 3600000).toString()
      }
    });

    // // Do send mail here
    sendMail(template);

    // // Return user
    return { user };

  },
  async resetPassword(parent, { data: { password, passwordToken } }, { prisma }, info) {

    // Validate Input
    await Joi.validate({ password, passwordToken }, ResetPasswordValidator, { abortEarly: false });

    let user;

    if (passwordToken.length > 6) {
      const decoded = jwt.verify(passwordToken, process.env.JWT_SECRET);
      const userId = decoded.userId;

      user = await prisma.query.users({
        where: {
          AND: [
            { id: userId },
            { resetToken: passwordToken },
            { resetTokenExpiration_gt: Date.now().toString() }
          ]

        }
      });

    } else {
      user = await prisma.query.users({
        where: {
          AND: [
            { resetToken: passwordToken },
            { resetTokenExpiration_gt: Date.now().toString() }
          ]
        }
      });
    }

    if (!user) {
      return {
        error: {
          field: "password",
          message: "User not found"
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const response = await prisma.mutation.updateUser({
      where: {
        id: user[0].id
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null
      }
    })

    // Email Template
    const message = `
      <p>Password reset was successful</p>
    `
    const template = passwordChangedSuccessful(user[0].email, message);

    // Do send mail
    sendMail(template);

    return { user: response }
  },
  async validateOTP(parent, { data: { passwordToken } }, { prisma }, info) {
    // Validate Input
    await Joi.validate({ passwordToken }, OTPValidator, { abortEarly: false });

    const user = await prisma.query.users({
      where: {
        AND: [
          { resetToken: passwordToken },
          { resetTokenExpiration_gt: Date.now().toString() }
        ]
      }
    });

    if (!user) {
      return {
        error: {
          field: "passwordToken",
          message: "Invalid OTP."
        }
      }
    }

    return { user: user[0] }

  }
}

export { UserMutations as default }