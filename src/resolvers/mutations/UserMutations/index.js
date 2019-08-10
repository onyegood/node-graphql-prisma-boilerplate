import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../../../utils/getUserId'
import generateToken from '../../../utils/generateToken'
import hashPassword from '../../../utils/hashPassword'
import sendMail from '../../../utils/mailler/sendMail';
import resetPasswordTemplate from '../../../utils/mailler/templates/resetPasswordTemplate';
import resetPasswordTemplateMobile from '../../../utils/mailler/templates/resetPasswordTemplateMobile';
import passwordChangedSuccessful from '../../../utils/mailler/templates/passwordChangedSuccessful';

const UserMutations = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
        role: {
          connect: {
            id: args.data.role
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

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },
  async forgotPassword(parent, args, { prisma }, info) {
    const { email, platform } = args.data;

    const user = await prisma.query.users({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error('Email does not exist')
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
      token = generateToken(user[0].id);
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
    }, info)

    // Do send mail here
    sendMail(template);

    return user[0];

  },
  async resetPassword(parent, args, { prisma }, info) {
    const { password, passwordToken } = args.data;

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
      throw new Error('User not found');
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
    }, info)

    // Email Template
    const message = `
      <p>Password reset was successful</p>
    `
    const template = passwordChangedSuccessful(user[0].email, message);

    // Do send mail
    sendMail(template);

    return response
  },
  async validateOTP(parent, args, { prisma }, info) {
    const { passwordToken } = args.data;

    const user = await prisma.query.users({
      where: {
        AND: [
          { resetToken: passwordToken },
          { resetTokenExpiration_gt: Date.now().toString() }
        ]
      }
    });

    if (!user) {
      throw new Error('Invalid OTP.');
    }

    return user[0]

  }
}

export { UserMutations as default }