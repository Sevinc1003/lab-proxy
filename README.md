# Lab: The Millisecond Leak

<img src="./public/main.png" width=600 />

## Introduction

**DevForge**, this underground community app for
builders and breakers. The previous dev swears the app is locked down: log out,
try to open `/dashboard`, and it kicks you back to the login screen. Looks
secure, right?

Open the network tab, slow your connection down, and watch carefully. For a
split second the protected page actually paints on your screen before it bounces
you away. The data was already in the browser. The lock was a curtain, not a
door.

This lab is about one skill you will use constantly in real Next.js apps:
**the Proxy**. In Next.js 16 the file that used to be called `middleware` is now
called `proxy`, and it runs on the **server, before your page is ever sent to
the browser**. That is exactly where route protection belongs. By the end you
will move the guard out of the React component and into a `proxy.js` file, so an
unauthorized page never reaches the user at all.

## The situation

> "Yep, the redirect 'works', but the protected page is
> still being shipped to the browser first and then yanked away. That flash you
> see? That's the real `/dashboard` HTML landing on the client before our
> `useEffect` runs if you try to tweek the context. We're checking the token in a Client Component, which means
> the check happens *after* the page already left the building. I want the
> decision made up front, on the server. The page should never reach the browser
> if the user isn't allowed to see it."

## The API

Auth is handled by the same separate REST API running at `http://localhost:8080` you've been using in previous labs. It **must be running** for anything to work.

The endpoints the frontend already talks to:

- `POST /api/signup` creates an account
- `POST /api/login` logs in (the server replies with a `Set-Cookie`)
- `POST /api/logout` logs out (the server clears the cookie)
- `GET  /api/me` answers "who am I?", returning the current user, or 401 if the
  token is bad or missing

The important detail: the token lives in an **httpOnly cookie**. That means your
JavaScript can never read it (`document.cookie` will not show it), which is good
for security. The cookie is sent automatically with every request to the same
host, and that includes requests your **proxy** sees on the server.

Before you write any code, log in once and open your browser DevTools, then go to
**Application > Cookies**. Find the cookie the backend set and **note its exact
name**. Your proxy is going to look for that cookie by name, so you need to know
what it is called.

## What is happening now

Open `app/components/ProtectedRoute.jsx`. It is a Client Component (`"use
client"`) that wraps `/dashboard` and `/admin`. Inside it there is a `useEffect`
that re-fetches `/api/me` to re-validate the token, and logs you out if the
backend says no.

Read that effect closely and you will see the problem: a `useEffect` only runs
**in the browser, after the component has mounted**. So the protected page is
already on the client by the time the check fires. That is the millisecond leak.

`app/context/AuthContext.jsx` is where the user is loaded on first paint, and
`app/dashboard/page.jsx` and `app/admin/page.jsx` are the two routes we need to
protect. `/admin` is meant for `ADMIN` users only.

## Getting started

Make sure the auth backend is running on `http://localhost:8080` first. Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in, click around
`/dashboard` and `/admin`, then log out and try to visit them directly by typing
the URL. You will get redirected to `/auth`. Try to open the components inspector and add your own context. 
Then you'll be able to see the protected page for a split second before the redirect happens. That is the millisecond leak.

## Your job

Work through these in order. Build the smallest working thing first, then layer
on the rest.

### 1. Read the portal lesson on Proxy first

This is the same proxy we build together in class, and the portal walks you
through it step by step. Read it before you write anything. It is the source of
truth for the exact API.

### 2. Create the proxy and redirect when the cookie is missing

Create a `proxy.js` file at the **project root** (the same level as the `app/`
folder, not inside it). Export a `proxy` function and a `config` with a
`matcher`.

Start with the cheapest possible check: look at the request's cookies, and if the
auth cookie (the one whose name you found in DevTools) is **not there**, redirect
the request to `/auth`. Use the `matcher` so the proxy only runs on `/dashboard`
and `/admin`.

### 3. Confirm the leak is gone

Log out, then try to open `/dashboard` directly. This time there should be **no
flash at all**, because the redirect now happens on the server before the page is
rendered. If you still see the page for a moment, your check is still running too
late.

### 4. Improve it: actually validate the token

A missing cookie is easy to catch, but a cookie can also be present and **invalid
or expired**. A presence check alone trusts the cookie blindly.

So strengthen the proxy: when the cookie *is* present, have the proxy call
`http://localhost:8080/api/me` to let the REST API validate the token for real.
Because the proxy runs on the server, the browser's cookie is not attached to
that outgoing request automatically, so you need to **forward it yourself** (pass
the incoming `cookie` header along on your fetch). If the API does not return an
ok response, redirect to `/auth`.

### 5. Enforce the role for `/admin`

The response from `/api/me` tells you who the user is, including their `role`. Use
that: if the request is for `/admin` and the user is not an `ADMIN`, send them
away (back to `/` or to `/auth`, your call). Only admins get through.

### 6. Remove the now-redundant client-side check

The whole point was to move protection to the server, so the old client-side
token re-validation is doing the same job twice and causing the flash. Go back
into `app/components/ProtectedRoute.jsx` and remove the `useEffect` that
re-fetches `/api/me` to re-validate the token. Resist the urge to gut everything
else blindly: change only what the proxy now owns, and make sure the app still
behaves.

## 💡 Think about it

There are two flavors of check happening here, and they are not the same thing.

- **The cheap one (optimistic):** "is there a cookie at all?" It is instant and
  needs no network call, but it trusts the cookie without verifying it.
- **The real one (secure):** "is this token actually valid?" That needs a call to
  the backend, which costs time on every protected request.

Your proxy runs on **every matched request, including the ones Next.js
prefetches** in the background. So calling `/api/me` on every navigation is not
free. Think about the trade-off you are making between speed and certainty, and
why the docs themselves warn against doing heavy work in a proxy. There is no
single right answer. The point is that you chose on purpose.

And the bigger idea: why is a server-side check fundamentally better than the
client-side one you inherited? (Hint: what does the user's browser already have
in its hands by the time a `useEffect` runs?)

## How to work through this

1. Read the portal lesson on Proxy.

2. Log in once and find the cookie name in DevTools.

3. Write the smallest proxy that redirects when the cookie is missing, and
   confirm the flash is gone.

4. Layer on the `/api/me` validation, forwarding the cookie.

5. Add the `ADMIN` role check for `/admin`.

6. Clean up `ProtectedRoute.jsx`.

## Checklist before you call it done

✅ A logged-out visit to `/dashboard` or `/admin` redirects to `/auth` with no
page flash at all.

✅ The proxy lives in `proxy.js` at the project root and only runs on the
protected routes via its `matcher`.

✅ A present but invalid or expired token is caught by the proxy (it calls
`/api/me`) and the user is redirected.

✅ A logged-in non-admin user cannot reach `/admin`.

✅ The client-side token re-validation `useEffect` has been removed from
`app/components/ProtectedRoute.jsx`.

✅ No errors in the browser console.

## If you finish early

✅ Redirect users who are *already logged in* away from `/auth` so they do not
see the login form again.

✅ Add a friendlier forbidden experience for non-admins instead of a bare
redirect.

## Key concepts to review

- [Proxy (formerly Middleware) in Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware)
  and the bundled docs at
  `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- `NextResponse.redirect` and reading `request.cookies` in a proxy
- The `config.matcher` and how to scope a proxy to specific routes
- Optimistic vs secure auth checks (and why heavy work in a proxy is discouraged)
- Why a server-side guard beats a client-side `useEffect` for route protection

## Delivering the lab

Open a Pull Request with your changes and share the link in the students portal.
