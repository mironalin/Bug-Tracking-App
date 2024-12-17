/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as StandaloneImport } from './routes/_standalone'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthPagesImport } from './routes/_authPages'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthPagesSignUpImport } from './routes/_authPages/sign-up'
import { Route as AuthPagesSignInImport } from './routes/_authPages/sign-in'
import { Route as StandaloneWorkspacesCreateImport } from './routes/_standalone/workspaces/create'
import { Route as AuthenticatedWorkspacesWorkspaceIdImport } from './routes/_authenticated/workspaces/$workspaceId'
import { Route as StandaloneWorkspacesWorkspaceIdSettingsImport } from './routes/_standalone/workspaces/$workspaceId/settings'
import { Route as StandaloneWorkspacesWorkspaceIdMembersImport } from './routes/_standalone/workspaces/$workspaceId/members'
import { Route as StandaloneWorkspacesWorkspaceIdJoinInviteCodeImport } from './routes/_standalone/workspaces/$workspaceId/join.$inviteCode'

// Create/Update Routes

const StandaloneRoute = StandaloneImport.update({
  id: '/_standalone',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthPagesRoute = AuthPagesImport.update({
  id: '/_authPages',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthPagesSignUpRoute = AuthPagesSignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => AuthPagesRoute,
} as any)

const AuthPagesSignInRoute = AuthPagesSignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => AuthPagesRoute,
} as any)

const StandaloneWorkspacesCreateRoute = StandaloneWorkspacesCreateImport.update(
  {
    id: '/workspaces/create',
    path: '/workspaces/create',
    getParentRoute: () => StandaloneRoute,
  } as any,
)

const AuthenticatedWorkspacesWorkspaceIdRoute =
  AuthenticatedWorkspacesWorkspaceIdImport.update({
    id: '/workspaces/$workspaceId',
    path: '/workspaces/$workspaceId',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const StandaloneWorkspacesWorkspaceIdSettingsRoute =
  StandaloneWorkspacesWorkspaceIdSettingsImport.update({
    id: '/workspaces/$workspaceId/settings',
    path: '/workspaces/$workspaceId/settings',
    getParentRoute: () => StandaloneRoute,
  } as any)

const StandaloneWorkspacesWorkspaceIdMembersRoute =
  StandaloneWorkspacesWorkspaceIdMembersImport.update({
    id: '/workspaces/$workspaceId/members',
    path: '/workspaces/$workspaceId/members',
    getParentRoute: () => StandaloneRoute,
  } as any)

const StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute =
  StandaloneWorkspacesWorkspaceIdJoinInviteCodeImport.update({
    id: '/workspaces/$workspaceId/join/$inviteCode',
    path: '/workspaces/$workspaceId/join/$inviteCode',
    getParentRoute: () => StandaloneRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authPages': {
      id: '/_authPages'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthPagesImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/_standalone': {
      id: '/_standalone'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof StandaloneImport
      parentRoute: typeof rootRoute
    }
    '/_authPages/sign-in': {
      id: '/_authPages/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof AuthPagesSignInImport
      parentRoute: typeof AuthPagesImport
    }
    '/_authPages/sign-up': {
      id: '/_authPages/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof AuthPagesSignUpImport
      parentRoute: typeof AuthPagesImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/workspaces/$workspaceId': {
      id: '/_authenticated/workspaces/$workspaceId'
      path: '/workspaces/$workspaceId'
      fullPath: '/workspaces/$workspaceId'
      preLoaderRoute: typeof AuthenticatedWorkspacesWorkspaceIdImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_standalone/workspaces/create': {
      id: '/_standalone/workspaces/create'
      path: '/workspaces/create'
      fullPath: '/workspaces/create'
      preLoaderRoute: typeof StandaloneWorkspacesCreateImport
      parentRoute: typeof StandaloneImport
    }
    '/_standalone/workspaces/$workspaceId/members': {
      id: '/_standalone/workspaces/$workspaceId/members'
      path: '/workspaces/$workspaceId/members'
      fullPath: '/workspaces/$workspaceId/members'
      preLoaderRoute: typeof StandaloneWorkspacesWorkspaceIdMembersImport
      parentRoute: typeof StandaloneImport
    }
    '/_standalone/workspaces/$workspaceId/settings': {
      id: '/_standalone/workspaces/$workspaceId/settings'
      path: '/workspaces/$workspaceId/settings'
      fullPath: '/workspaces/$workspaceId/settings'
      preLoaderRoute: typeof StandaloneWorkspacesWorkspaceIdSettingsImport
      parentRoute: typeof StandaloneImport
    }
    '/_standalone/workspaces/$workspaceId/join/$inviteCode': {
      id: '/_standalone/workspaces/$workspaceId/join/$inviteCode'
      path: '/workspaces/$workspaceId/join/$inviteCode'
      fullPath: '/workspaces/$workspaceId/join/$inviteCode'
      preLoaderRoute: typeof StandaloneWorkspacesWorkspaceIdJoinInviteCodeImport
      parentRoute: typeof StandaloneImport
    }
  }
}

// Create and export the route tree

interface AuthPagesRouteChildren {
  AuthPagesSignInRoute: typeof AuthPagesSignInRoute
  AuthPagesSignUpRoute: typeof AuthPagesSignUpRoute
}

const AuthPagesRouteChildren: AuthPagesRouteChildren = {
  AuthPagesSignInRoute: AuthPagesSignInRoute,
  AuthPagesSignUpRoute: AuthPagesSignUpRoute,
}

const AuthPagesRouteWithChildren = AuthPagesRoute._addFileChildren(
  AuthPagesRouteChildren,
)

interface AuthenticatedRouteChildren {
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedWorkspacesWorkspaceIdRoute: typeof AuthenticatedWorkspacesWorkspaceIdRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedWorkspacesWorkspaceIdRoute:
    AuthenticatedWorkspacesWorkspaceIdRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

interface StandaloneRouteChildren {
  StandaloneWorkspacesCreateRoute: typeof StandaloneWorkspacesCreateRoute
  StandaloneWorkspacesWorkspaceIdMembersRoute: typeof StandaloneWorkspacesWorkspaceIdMembersRoute
  StandaloneWorkspacesWorkspaceIdSettingsRoute: typeof StandaloneWorkspacesWorkspaceIdSettingsRoute
  StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute: typeof StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute
}

const StandaloneRouteChildren: StandaloneRouteChildren = {
  StandaloneWorkspacesCreateRoute: StandaloneWorkspacesCreateRoute,
  StandaloneWorkspacesWorkspaceIdMembersRoute:
    StandaloneWorkspacesWorkspaceIdMembersRoute,
  StandaloneWorkspacesWorkspaceIdSettingsRoute:
    StandaloneWorkspacesWorkspaceIdSettingsRoute,
  StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute:
    StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute,
}

const StandaloneRouteWithChildren = StandaloneRoute._addFileChildren(
  StandaloneRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof StandaloneRouteWithChildren
  '/sign-in': typeof AuthPagesSignInRoute
  '/sign-up': typeof AuthPagesSignUpRoute
  '/': typeof AuthenticatedIndexRoute
  '/workspaces/$workspaceId': typeof AuthenticatedWorkspacesWorkspaceIdRoute
  '/workspaces/create': typeof StandaloneWorkspacesCreateRoute
  '/workspaces/$workspaceId/members': typeof StandaloneWorkspacesWorkspaceIdMembersRoute
  '/workspaces/$workspaceId/settings': typeof StandaloneWorkspacesWorkspaceIdSettingsRoute
  '/workspaces/$workspaceId/join/$inviteCode': typeof StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute
}

export interface FileRoutesByTo {
  '': typeof StandaloneRouteWithChildren
  '/sign-in': typeof AuthPagesSignInRoute
  '/sign-up': typeof AuthPagesSignUpRoute
  '/': typeof AuthenticatedIndexRoute
  '/workspaces/$workspaceId': typeof AuthenticatedWorkspacesWorkspaceIdRoute
  '/workspaces/create': typeof StandaloneWorkspacesCreateRoute
  '/workspaces/$workspaceId/members': typeof StandaloneWorkspacesWorkspaceIdMembersRoute
  '/workspaces/$workspaceId/settings': typeof StandaloneWorkspacesWorkspaceIdSettingsRoute
  '/workspaces/$workspaceId/join/$inviteCode': typeof StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authPages': typeof AuthPagesRouteWithChildren
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/_standalone': typeof StandaloneRouteWithChildren
  '/_authPages/sign-in': typeof AuthPagesSignInRoute
  '/_authPages/sign-up': typeof AuthPagesSignUpRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_authenticated/workspaces/$workspaceId': typeof AuthenticatedWorkspacesWorkspaceIdRoute
  '/_standalone/workspaces/create': typeof StandaloneWorkspacesCreateRoute
  '/_standalone/workspaces/$workspaceId/members': typeof StandaloneWorkspacesWorkspaceIdMembersRoute
  '/_standalone/workspaces/$workspaceId/settings': typeof StandaloneWorkspacesWorkspaceIdSettingsRoute
  '/_standalone/workspaces/$workspaceId/join/$inviteCode': typeof StandaloneWorkspacesWorkspaceIdJoinInviteCodeRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/sign-in'
    | '/sign-up'
    | '/'
    | '/workspaces/$workspaceId'
    | '/workspaces/create'
    | '/workspaces/$workspaceId/members'
    | '/workspaces/$workspaceId/settings'
    | '/workspaces/$workspaceId/join/$inviteCode'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/sign-in'
    | '/sign-up'
    | '/'
    | '/workspaces/$workspaceId'
    | '/workspaces/create'
    | '/workspaces/$workspaceId/members'
    | '/workspaces/$workspaceId/settings'
    | '/workspaces/$workspaceId/join/$inviteCode'
  id:
    | '__root__'
    | '/_authPages'
    | '/_authenticated'
    | '/_standalone'
    | '/_authPages/sign-in'
    | '/_authPages/sign-up'
    | '/_authenticated/'
    | '/_authenticated/workspaces/$workspaceId'
    | '/_standalone/workspaces/create'
    | '/_standalone/workspaces/$workspaceId/members'
    | '/_standalone/workspaces/$workspaceId/settings'
    | '/_standalone/workspaces/$workspaceId/join/$inviteCode'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthPagesRoute: typeof AuthPagesRouteWithChildren
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  StandaloneRoute: typeof StandaloneRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthPagesRoute: AuthPagesRouteWithChildren,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  StandaloneRoute: StandaloneRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authPages",
        "/_authenticated",
        "/_standalone"
      ]
    },
    "/_authPages": {
      "filePath": "_authPages.tsx",
      "children": [
        "/_authPages/sign-in",
        "/_authPages/sign-up"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/",
        "/_authenticated/workspaces/$workspaceId"
      ]
    },
    "/_standalone": {
      "filePath": "_standalone.tsx",
      "children": [
        "/_standalone/workspaces/create",
        "/_standalone/workspaces/$workspaceId/members",
        "/_standalone/workspaces/$workspaceId/settings",
        "/_standalone/workspaces/$workspaceId/join/$inviteCode"
      ]
    },
    "/_authPages/sign-in": {
      "filePath": "_authPages/sign-in.tsx",
      "parent": "/_authPages"
    },
    "/_authPages/sign-up": {
      "filePath": "_authPages/sign-up.tsx",
      "parent": "/_authPages"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/workspaces/$workspaceId": {
      "filePath": "_authenticated/workspaces/$workspaceId.tsx",
      "parent": "/_authenticated"
    },
    "/_standalone/workspaces/create": {
      "filePath": "_standalone/workspaces/create.tsx",
      "parent": "/_standalone"
    },
    "/_standalone/workspaces/$workspaceId/members": {
      "filePath": "_standalone/workspaces/$workspaceId/members.tsx",
      "parent": "/_standalone"
    },
    "/_standalone/workspaces/$workspaceId/settings": {
      "filePath": "_standalone/workspaces/$workspaceId/settings.tsx",
      "parent": "/_standalone"
    },
    "/_standalone/workspaces/$workspaceId/join/$inviteCode": {
      "filePath": "_standalone/workspaces/$workspaceId/join.$inviteCode.tsx",
      "parent": "/_standalone"
    }
  }
}
ROUTE_MANIFEST_END */
