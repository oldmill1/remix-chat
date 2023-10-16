import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, ActionFunctionArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import universeStylesHref from '~/styles/universe.css';
import invariant from 'tiny-invariant';
import { updatePrompt } from '~/data';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const promptId = formData.get('promptId') as string;
  invariant(promptId, 'Missing promptId param');
  const x = Number(formData.get('x'));
  const y = Number(formData.get('y'));

  if (!promptId) {
    return new Response('Missing promptId param', { status: 400 });
  }

  if (isNaN(x) || isNaN(y)) {
    return new Response('Invalid x or y', { status: 400 });
  }

  await updatePrompt(promptId, { x, y });
  return new Response(null, { status: 200 });
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300&display=swap',
  },
  { rel: 'stylesheet', href: '/styles/globals.css' },
  { rel: 'stylesheet', href: '/styles/reset.css' },
  { rel: 'stylesheet', href: universeStylesHref },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
