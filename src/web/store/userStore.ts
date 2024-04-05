import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';

import userService, { SignInReq } from '@/web/api/services/userService';
import { getItem, removeItem, setItem } from '@/web/utils/storage';

import { UserInfo, UserToken } from '@/types/entity';
import { StorageEnum } from '@/types/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<UserToken>(StorageEnum.Token) || {},
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { notification, message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();

  const signInMutation = useMutation(userService.signin);

  const signIn = async (data: SignInReq) => {
    try {
      const res = await signInMutation.mutateAsync(data);
      const { user, accessToken, refreshToken } = {
        "user": {
          "id": "3181ebf0-7ef8-4197-9c4d-3c24c68f969c",
          "username": "admin@gmail.com",
          "email": "Adeline39@gmail.com",
          "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/602.jpg",
          "createdAt": "2024-06-24T13:00:36.639Z",
          "updatedAt": "2024-04-04T22:06:39.926Z",
          "password": "demo1234",
          "role": {
            "id": "4281707933534332",
            "name": "Admin",
            "label": "admin",
            "status": 1,
            "order": 1,
            "desc": "Super Admin",
            "permission": [
              {
                "id": "9100714781927703",
                "parentId": "",
                "label": "sys.menu.dashboard",
                "name": "Dashboard",
                "icon": "ic-analysis",
                "type": 0,
                "route": "dashboard",
                "order": 1,
                "children": [
                  {
                    "id": "8426999229400979",
                    "parentId": "9100714781927703",
                    "label": "sys.menu.workbench",
                    "name": "Workbench",
                    "type": 1,
                    "route": "workbench",
                    "component": "/dashboard/workbench/index.tsx"
                  },
                  {
                    "id": "9710971640510357",
                    "parentId": "9100714781927703",
                    "label": "sys.menu.analysis",
                    "name": "Analysis",
                    "type": 1,
                    "route": "analysis",
                    "component": "/dashboard/analysis/index.tsx"
                  }
                ]
              },
              {
                "id": "0901673425580518",
                "parentId": "",
                "label": "sys.menu.management",
                "name": "Management",
                "icon": "ic-management",
                "type": 0,
                "route": "management",
                "order": 2,
                "children": [
                  {
                    "id": "2781684678535711",
                    "parentId": "0901673425580518",
                    "label": "sys.menu.user.index",
                    "name": "User",
                    "type": 0,
                    "route": "user",
                    "children": [
                      {
                        "id": "4754063958766648",
                        "parentId": "2781684678535711",
                        "label": "sys.menu.user.profile",
                        "name": "Profile",
                        "type": 1,
                        "route": "profile",
                        "component": "/management/user/profile/index.tsx"
                      },
                      {
                        "id": "2516598794787938",
                        "parentId": "2781684678535711",
                        "label": "sys.menu.user.account",
                        "name": "Account",
                        "type": 1,
                        "route": "account",
                        "component": "/management/user/account/index.tsx"
                      }
                    ]
                  },
                  {
                    "id": "0249937641030250",
                    "parentId": "0901673425580518",
                    "label": "sys.menu.system.index",
                    "name": "System",
                    "type": 0,
                    "route": "system",
                    "children": [
                      {
                        "id": "1985890042972842",
                        "parentId": "0249937641030250",
                        "label": "sys.menu.system.organization",
                        "name": "Organization",
                        "type": 1,
                        "route": "organization",
                        "component": "/management/system/organization/index.tsx"
                      },
                      {
                        "id": "4359580910369984",
                        "parentId": "0249937641030250",
                        "label": "sys.menu.system.permission",
                        "name": "Permission",
                        "type": 1,
                        "route": "permission",
                        "component": "/management/system/permission/index.tsx"
                      },
                      {
                        "id": "1689241785490759",
                        "parentId": "0249937641030250",
                        "label": "sys.menu.system.role",
                        "name": "Role",
                        "type": 1,
                        "route": "role",
                        "component": "/management/system/role/index.tsx"
                      },
                      {
                        "id": "0157880245365433",
                        "parentId": "0249937641030250",
                        "label": "sys.menu.system.user",
                        "name": "User",
                        "type": 1,
                        "route": "user",
                        "component": "/management/system/user/index.tsx"
                      },
                      {
                        "id": "0157880245365434",
                        "parentId": "0249937641030250",
                        "label": "sys.menu.system.user_detail",
                        "name": "User Detail",
                        "type": 1,
                        "route": "user/:id",
                        "component": "/management/system/user/detail.tsx",
                        "hide": true
                      }
                    ]
                  }
                ]
              },
              {
                "id": "2271615060673773",
                "parentId": "",
                "label": "sys.menu.components",
                "name": "Components",
                "icon": "solar:widget-5-bold-duotone",
                "type": 0,
                "route": "components",
                "order": 3,
                "children": [
                  {
                    "id": "2478488238255411",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.icon",
                    "name": "Icon",
                    "type": 1,
                    "route": "icon",
                    "component": "/components/icon/index.tsx"
                  },
                  {
                    "id": "6755238352318767",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.animate",
                    "name": "Animate",
                    "type": 1,
                    "route": "animate",
                    "component": "/components/animate/index.tsx"
                  },
                  {
                    "id": "9992476513546805",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.scroll",
                    "name": "Scroll",
                    "type": 1,
                    "route": "scroll",
                    "component": "/components/scroll/index.tsx"
                  },
                  {
                    "id": "1755562695856395",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.markdown",
                    "name": "Markdown",
                    "type": 1,
                    "route": "markdown",
                    "component": "/components/markdown/index.tsx"
                  },
                  {
                    "id": "2122547769468069",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.editor",
                    "name": "Editor",
                    "type": 1,
                    "route": "editor",
                    "component": "/components/editor/index.tsx"
                  },
                  {
                    "id": "2501920741714350",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.i18n",
                    "name": "Multi Language",
                    "type": 1,
                    "route": "i18n",
                    "component": "/components/multi-language/index.tsx"
                  },
                  {
                    "id": "2013577074467956",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.upload",
                    "name": "upload",
                    "type": 1,
                    "route": "Upload",
                    "component": "/components/upload/index.tsx"
                  },
                  {
                    "id": "7749726274771764",
                    "parentId": "2271615060673773",
                    "label": "sys.menu.chart",
                    "name": "Chart",
                    "type": 1,
                    "route": "chart",
                    "component": "/components/chart/index.tsx"
                  }
                ]
              },
              {
                "id": "8132044808088488",
                "parentId": "",
                "label": "sys.menu.functions",
                "name": "functions",
                "icon": "solar:plain-2-bold-duotone",
                "type": 0,
                "route": "functions",
                "order": 4,
                "children": [
                  {
                    "id": "3667930780705750",
                    "parentId": "8132044808088488",
                    "label": "sys.menu.clipboard",
                    "name": "Clipboard",
                    "type": 1,
                    "route": "clipboard",
                    "component": "/functions/clipboard/index.tsx"
                  }
                ]
              },
              {
                "id": "0194818428516575",
                "parentId": "",
                "label": "sys.menu.menulevel.index",
                "name": "Menu Level",
                "icon": "ic-menulevel",
                "type": 0,
                "route": "menu-level",
                "order": 5,
                "children": [
                  {
                    "id": "0144431332471389",
                    "parentId": "0194818428516575",
                    "label": "sys.menu.menulevel.1a",
                    "name": "Menu Level 1a",
                    "type": 1,
                    "route": "menu-level-1a",
                    "component": "/menu-level/menu-level-1a/index.tsx"
                  },
                  {
                    "id": "7572529636800586",
                    "parentId": "0194818428516575",
                    "label": "sys.menu.menulevel.1b.index",
                    "name": "Menu Level 1b",
                    "type": 0,
                    "route": "menu-level-1b",
                    "children": [
                      {
                        "id": "3653745576583237",
                        "parentId": "7572529636800586",
                        "label": "sys.menu.menulevel.1b.2a",
                        "name": "Menu Level 2a",
                        "type": 1,
                        "route": "menu-level-2a",
                        "component": "/menu-level/menu-level-1b/menu-level-2a/index.tsx"
                      },
                      {
                        "id": "4873136353891364",
                        "parentId": "7572529636800586",
                        "label": "sys.menu.menulevel.1b.2b.index",
                        "name": "Menu Level 2b",
                        "type": 0,
                        "route": "menu-level-2b",
                        "children": [
                          {
                            "id": "4233029726998055",
                            "parentId": "4873136353891364",
                            "label": "sys.menu.menulevel.1b.2b.3a",
                            "name": "Menu Level 3a",
                            "type": 1,
                            "route": "menu-level-3a",
                            "component": "/menu-level/menu-level-1b/menu-level-2b/menu-level-3a/index.tsx"
                          },
                          {
                            "id": "3298034742548454",
                            "parentId": "4873136353891364",
                            "label": "sys.menu.menulevel.1b.2b.3b",
                            "name": "Menu Level 3b",
                            "type": 1,
                            "route": "menu-level-3b",
                            "component": "/menu-level/menu-level-1b/menu-level-2b/menu-level-3b/index.tsx"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "id": "9406067785553476",
                "parentId": "",
                "label": "sys.menu.error.index",
                "name": "Error",
                "icon": "bxs:error-alt",
                "type": 0,
                "route": "error",
                "order": 6,
                "children": [
                  {
                    "id": "8557056851997154",
                    "parentId": "9406067785553476",
                    "label": "sys.menu.error.403",
                    "name": "403",
                    "type": 1,
                    "route": "403",
                    "component": "/sys/error/Page403.tsx"
                  },
                  {
                    "id": "5095669208159005",
                    "parentId": "9406067785553476",
                    "label": "sys.menu.error.404",
                    "name": "404",
                    "type": 1,
                    "route": "404",
                    "component": "/sys/error/Page404.tsx"
                  },
                  {
                    "id": "0225992135973772",
                    "parentId": "9406067785553476",
                    "label": "sys.menu.error.500",
                    "name": "500",
                    "type": 1,
                    "route": "500",
                    "component": "/sys/error/Page500.tsx"
                  }
                ]
              },
              {
                "id": "3981225257359246",
                "parentId": "",
                "label": "sys.menu.calendar",
                "name": "Calendar",
                "icon": "solar:calendar-bold-duotone",
                "type": 1,
                "route": "calendar",
                "component": "/sys/others/calendar/index.tsx"
              },
              {
                "id": "3513985683886393",
                "parentId": "",
                "label": "sys.menu.kanban",
                "name": "kanban",
                "icon": "solar:clipboard-bold-duotone",
                "type": 1,
                "route": "kanban",
                "component": "/sys/others/kanban/index.tsx"
              },
              {
                "id": "5455837930804461",
                "parentId": "",
                "label": "sys.menu.disabled",
                "name": "Disabled",
                "icon": "ic_disabled",
                "type": 1,
                "route": "disabled",
                "status": 0,
                "component": "/sys/others/calendar/index.tsx"
              },
              {
                "id": "7728048658221587",
                "parentId": "",
                "label": "sys.menu.label",
                "name": "Label",
                "icon": "ic_label",
                "type": 1,
                "route": "label",
                "newFeature": true,
                "component": "/sys/others/blank.tsx"
              },
              {
                "id": "5733704222120995",
                "parentId": "",
                "label": "sys.menu.frame",
                "name": "Frame",
                "icon": "ic_external",
                "type": 0,
                "route": "frame",
                "children": [
                  {
                    "id": "9884486809510480",
                    "parentId": "5733704222120995",
                    "label": "sys.menu.external_link",
                    "name": "External Link",
                    "type": 1,
                    "route": "external_link",
                    "hideTab": true,
                    "component": "/sys/others/iframe/external-link.tsx",
                    "frameSrc": "https://ant.design/"
                  },
                  {
                    "id": "9299640886731819",
                    "parentId": "5733704222120995",
                    "label": "sys.menu.iframe",
                    "name": "Iframe",
                    "type": 1,
                    "route": "frame",
                    "component": "/sys/others/iframe/index.tsx",
                    "frameSrc": "https://ant.design/"
                  }
                ]
              },
              {
                "id": "0941594969900756",
                "parentId": "",
                "label": "sys.menu.blank",
                "name": "Disabled",
                "icon": "ic_blank",
                "type": 1,
                "route": "blank",
                "component": "/sys/others/blank.tsx"
              }
            ]
          },
          "permissions": [
            {
              "id": "9100714781927703",
              "parentId": "",
              "label": "sys.menu.dashboard",
              "name": "Dashboard",
              "icon": "ic-analysis",
              "type": 0,
              "route": "dashboard",
              "order": 1,
              "children": [
                {
                  "id": "8426999229400979",
                  "parentId": "9100714781927703",
                  "label": "sys.menu.workbench",
                  "name": "Workbench",
                  "type": 1,
                  "route": "workbench",
                  "component": "/dashboard/workbench/index.tsx"
                },
                {
                  "id": "9710971640510357",
                  "parentId": "9100714781927703",
                  "label": "sys.menu.analysis",
                  "name": "Analysis",
                  "type": 1,
                  "route": "analysis",
                  "component": "/dashboard/analysis/index.tsx"
                }
              ]
            },
            {
              "id": "0901673425580518",
              "parentId": "",
              "label": "sys.menu.management",
              "name": "Management",
              "icon": "ic-management",
              "type": 0,
              "route": "management",
              "order": 2,
              "children": [
                {
                  "id": "2781684678535711",
                  "parentId": "0901673425580518",
                  "label": "sys.menu.user.index",
                  "name": "User",
                  "type": 0,
                  "route": "user",
                  "children": [
                    {
                      "id": "4754063958766648",
                      "parentId": "2781684678535711",
                      "label": "sys.menu.user.profile",
                      "name": "Profile",
                      "type": 1,
                      "route": "profile",
                      "component": "/management/user/profile/index.tsx"
                    },
                    {
                      "id": "2516598794787938",
                      "parentId": "2781684678535711",
                      "label": "sys.menu.user.account",
                      "name": "Account",
                      "type": 1,
                      "route": "account",
                      "component": "/management/user/account/index.tsx"
                    }
                  ]
                },
                {
                  "id": "0249937641030250",
                  "parentId": "0901673425580518",
                  "label": "sys.menu.system.index",
                  "name": "System",
                  "type": 0,
                  "route": "system",
                  "children": [
                    {
                      "id": "1985890042972842",
                      "parentId": "0249937641030250",
                      "label": "sys.menu.system.organization",
                      "name": "Organization",
                      "type": 1,
                      "route": "organization",
                      "component": "/management/system/organization/index.tsx"
                    },
                    {
                      "id": "4359580910369984",
                      "parentId": "0249937641030250",
                      "label": "sys.menu.system.permission",
                      "name": "Permission",
                      "type": 1,
                      "route": "permission",
                      "component": "/management/system/permission/index.tsx"
                    },
                    {
                      "id": "1689241785490759",
                      "parentId": "0249937641030250",
                      "label": "sys.menu.system.role",
                      "name": "Role",
                      "type": 1,
                      "route": "role",
                      "component": "/management/system/role/index.tsx"
                    },
                    {
                      "id": "0157880245365433",
                      "parentId": "0249937641030250",
                      "label": "sys.menu.system.user",
                      "name": "User",
                      "type": 1,
                      "route": "user",
                      "component": "/management/system/user/index.tsx"
                    },
                    {
                      "id": "0157880245365434",
                      "parentId": "0249937641030250",
                      "label": "sys.menu.system.user_detail",
                      "name": "User Detail",
                      "type": 1,
                      "route": "user/:id",
                      "component": "/management/system/user/detail.tsx",
                      "hide": true
                    }
                  ]
                }
              ]
            },
            {
              "id": "2271615060673773",
              "parentId": "",
              "label": "sys.menu.components",
              "name": "Components",
              "icon": "solar:widget-5-bold-duotone",
              "type": 0,
              "route": "components",
              "order": 3,
              "children": [
                {
                  "id": "2478488238255411",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.icon",
                  "name": "Icon",
                  "type": 1,
                  "route": "icon",
                  "component": "/components/icon/index.tsx"
                },
                {
                  "id": "6755238352318767",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.animate",
                  "name": "Animate",
                  "type": 1,
                  "route": "animate",
                  "component": "/components/animate/index.tsx"
                },
                {
                  "id": "9992476513546805",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.scroll",
                  "name": "Scroll",
                  "type": 1,
                  "route": "scroll",
                  "component": "/components/scroll/index.tsx"
                },
                {
                  "id": "1755562695856395",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.markdown",
                  "name": "Markdown",
                  "type": 1,
                  "route": "markdown",
                  "component": "/components/markdown/index.tsx"
                },
                {
                  "id": "2122547769468069",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.editor",
                  "name": "Editor",
                  "type": 1,
                  "route": "editor",
                  "component": "/components/editor/index.tsx"
                },
                {
                  "id": "2501920741714350",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.i18n",
                  "name": "Multi Language",
                  "type": 1,
                  "route": "i18n",
                  "component": "/components/multi-language/index.tsx"
                },
                {
                  "id": "2013577074467956",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.upload",
                  "name": "upload",
                  "type": 1,
                  "route": "Upload",
                  "component": "/components/upload/index.tsx"
                },
                {
                  "id": "7749726274771764",
                  "parentId": "2271615060673773",
                  "label": "sys.menu.chart",
                  "name": "Chart",
                  "type": 1,
                  "route": "chart",
                  "component": "/components/chart/index.tsx"
                }
              ]
            },
            {
              "id": "8132044808088488",
              "parentId": "",
              "label": "sys.menu.functions",
              "name": "functions",
              "icon": "solar:plain-2-bold-duotone",
              "type": 0,
              "route": "functions",
              "order": 4,
              "children": [
                {
                  "id": "3667930780705750",
                  "parentId": "8132044808088488",
                  "label": "sys.menu.clipboard",
                  "name": "Clipboard",
                  "type": 1,
                  "route": "clipboard",
                  "component": "/functions/clipboard/index.tsx"
                }
              ]
            },
            {
              "id": "0194818428516575",
              "parentId": "",
              "label": "sys.menu.menulevel.index",
              "name": "Menu Level",
              "icon": "ic-menulevel",
              "type": 0,
              "route": "menu-level",
              "order": 5,
              "children": [
                {
                  "id": "0144431332471389",
                  "parentId": "0194818428516575",
                  "label": "sys.menu.menulevel.1a",
                  "name": "Menu Level 1a",
                  "type": 1,
                  "route": "menu-level-1a",
                  "component": "/menu-level/menu-level-1a/index.tsx"
                },
                {
                  "id": "7572529636800586",
                  "parentId": "0194818428516575",
                  "label": "sys.menu.menulevel.1b.index",
                  "name": "Menu Level 1b",
                  "type": 0,
                  "route": "menu-level-1b",
                  "children": [
                    {
                      "id": "3653745576583237",
                      "parentId": "7572529636800586",
                      "label": "sys.menu.menulevel.1b.2a",
                      "name": "Menu Level 2a",
                      "type": 1,
                      "route": "menu-level-2a",
                      "component": "/menu-level/menu-level-1b/menu-level-2a/index.tsx"
                    },
                    {
                      "id": "4873136353891364",
                      "parentId": "7572529636800586",
                      "label": "sys.menu.menulevel.1b.2b.index",
                      "name": "Menu Level 2b",
                      "type": 0,
                      "route": "menu-level-2b",
                      "children": [
                        {
                          "id": "4233029726998055",
                          "parentId": "4873136353891364",
                          "label": "sys.menu.menulevel.1b.2b.3a",
                          "name": "Menu Level 3a",
                          "type": 1,
                          "route": "menu-level-3a",
                          "component": "/menu-level/menu-level-1b/menu-level-2b/menu-level-3a/index.tsx"
                        },
                        {
                          "id": "3298034742548454",
                          "parentId": "4873136353891364",
                          "label": "sys.menu.menulevel.1b.2b.3b",
                          "name": "Menu Level 3b",
                          "type": 1,
                          "route": "menu-level-3b",
                          "component": "/menu-level/menu-level-1b/menu-level-2b/menu-level-3b/index.tsx"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "9406067785553476",
              "parentId": "",
              "label": "sys.menu.error.index",
              "name": "Error",
              "icon": "bxs:error-alt",
              "type": 0,
              "route": "error",
              "order": 6,
              "children": [
                {
                  "id": "8557056851997154",
                  "parentId": "9406067785553476",
                  "label": "sys.menu.error.403",
                  "name": "403",
                  "type": 1,
                  "route": "403",
                  "component": "/sys/error/Page403.tsx"
                },
                {
                  "id": "5095669208159005",
                  "parentId": "9406067785553476",
                  "label": "sys.menu.error.404",
                  "name": "404",
                  "type": 1,
                  "route": "404",
                  "component": "/sys/error/Page404.tsx"
                },
                {
                  "id": "0225992135973772",
                  "parentId": "9406067785553476",
                  "label": "sys.menu.error.500",
                  "name": "500",
                  "type": 1,
                  "route": "500",
                  "component": "/sys/error/Page500.tsx"
                }
              ]
            },
            {
              "id": "3981225257359246",
              "parentId": "",
              "label": "sys.menu.calendar",
              "name": "Calendar",
              "icon": "solar:calendar-bold-duotone",
              "type": 1,
              "route": "calendar",
              "component": "/sys/others/calendar/index.tsx"
            },
            {
              "id": "3513985683886393",
              "parentId": "",
              "label": "sys.menu.kanban",
              "name": "kanban",
              "icon": "solar:clipboard-bold-duotone",
              "type": 1,
              "route": "kanban",
              "component": "/sys/others/kanban/index.tsx"
            },
            {
              "id": "5455837930804461",
              "parentId": "",
              "label": "sys.menu.disabled",
              "name": "Disabled",
              "icon": "ic_disabled",
              "type": 1,
              "route": "disabled",
              "status": 0,
              "component": "/sys/others/calendar/index.tsx"
            },
            {
              "id": "7728048658221587",
              "parentId": "",
              "label": "sys.menu.label",
              "name": "Label",
              "icon": "ic_label",
              "type": 1,
              "route": "label",
              "newFeature": true,
              "component": "/sys/others/blank.tsx"
            },
            {
              "id": "5733704222120995",
              "parentId": "",
              "label": "sys.menu.frame",
              "name": "Frame",
              "icon": "ic_external",
              "type": 0,
              "route": "frame",
              "children": [
                {
                  "id": "9884486809510480",
                  "parentId": "5733704222120995",
                  "label": "sys.menu.external_link",
                  "name": "External Link",
                  "type": 1,
                  "route": "external_link",
                  "hideTab": true,
                  "component": "/sys/others/iframe/external-link.tsx",
                  "frameSrc": "https://ant.design/"
                },
                {
                  "id": "9299640886731819",
                  "parentId": "5733704222120995",
                  "label": "sys.menu.iframe",
                  "name": "Iframe",
                  "type": 1,
                  "route": "frame",
                  "component": "/sys/others/iframe/index.tsx",
                  "frameSrc": "https://ant.design/"
                }
              ]
            },
            {
              "id": "0941594969900756",
              "parentId": "",
              "label": "sys.menu.blank",
              "name": "Disabled",
              "icon": "ic_blank",
              "type": 1,
              "route": "blank",
              "component": "/sys/others/blank.tsx"
            }
          ]
        },
        "accessToken": "2f223353-d541-41ea-9ec0-fb333db45f15",
        "refreshToken": "04610d06-e62b-4f5b-88ce-e423fb9a8671"
      };
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${data.username}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};
