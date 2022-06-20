import type { User } from './user';

import { Octokit } from 'octokit';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
const octokit = new Octokit();

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username } = await req.body;

  try {
    const {
      data: { login, avatar_url },
    } = await octokit.rest.users.getByUsername({ username });

    const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User;
    req.session.user = user;

    console.log(`
    ========================
    login.ts
    req.body: ${JSON.stringify(req.body)}
    req.session: ${JSON.stringify(req.session)}
    ========================
    `);

    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
