/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/mufeng889/elegant-router
// Vue auto route: https://github.com/soybeanjs/elegant-router


declare module "@elegant-router/types" {
  type ElegantConstRoute = import('@ohh-889/react-auto-route').ElegantConstRoute;

  /**
   * route layout
   */
  export type RouteLayout = "base" | "blank";

  /**
   * route map
   */
  export type RouteMap = {
    "root": "/";
    "not-found": "*";
    "exception": "/exception";
    "exception_403": "403";
    "exception_404": "404";
    "exception_500": "500";
    "document": "/document";
    "document_project": "project";
    "document_project-link": "project-link";
    "document_react": "react";
    "document_vite": "vite";
    "document_unocss": "unocss";
    "document_procomponents": "procomponents";
    "document_antd": "antd";
    "logout": "/logout";
    "403": "/403";
    "404": "/404";
    "500": "/500";
    "about": "/about";
    "function": "/function";
    "function_event-bus": "event-bus";
    "function_hide-child": "hide-child";
    "function_hide-child_one": "one";
    "function_hide-child_three": "three";
    "function_hide-child_two": "two";
    "function_multi-tab": "multi-tab";
    "function_request": "request";
    "function_super-page": "super-page";
    "function_tab": "tab";
    "function_toggle-auth": "toggle-auth";
    "home": "/home";
    "iframe-page": "/iframe-page/:url";
    "login": "/login";
    "login_code-login": "code-login";
    "login_pwd-login": "pwd-login";
    "login_register": "register";
    "login_reset-pwd": "reset-pwd";
    "manage": "/manage";
    "manage_menu": "menu";
    "manage_role": "role";
    "manage_user": "user";
    "manage_user-detail": "user-detail/:id";
    "multi-menu": "/multi-menu";
    "multi-menu_first": "first";
    "multi-menu_first_child": "child";
    "multi-menu_second": "second";
    "multi-menu_second_child": "child";
    "multi-menu_second_child_home": "home";
    "user-center": "/user-center";
  };

  /**
   * route key
   */
  export type RouteKey = keyof RouteMap;

  /**
   * route path
   */
  export type RoutePath = RouteMap[RouteKey];

  /**
   * custom route key
   */
  export type CustomRouteKey = Extract<
    RouteKey,
    | "root"
    | "not-found"
    | "exception"
    | "exception_403"
    | "exception_404"
    | "exception_500"
    | "document"
    | "document_project"
    | "document_project-link"
    | "document_react"
    | "document_vite"
    | "document_unocss"
    | "document_procomponents"
    | "document_antd"
    | "logout"
  >;

  /**
   * the generated route key
   */
  export type GeneratedRouteKey = Exclude<RouteKey, CustomRouteKey>;

  /**
   * the first level route key, which contain the layout of the route
   */
  export type FirstLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "about"
    | "function"
    | "home"
    | "iframe-page"
    | "login"
    | "manage"
    | "multi-menu"
    | "user-center"
  >;

  /**
   * the custom first level route key
   */
  export type CustomFirstLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
    | "exception"
    | "document"
    | "logout"
  >;

  /**
   * the last level route key, which has the page file
   */
  export type LastLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "iframe-page"
    | "about"
    | "function_event-bus"
    | "function_hide-child_one"
    | "function_hide-child_three"
    | "function_hide-child_two"
    | "function_multi-tab"
    | "function_request"
    | "function_super-page"
    | "function_tab"
    | "function_toggle-auth"
    | "home"
    | "login_code-login"
    | "login"
    | "login_pwd-login"
    | "login_register"
    | "login_reset-pwd"
    | "manage_menu"
    | "manage_role"
    | "manage_user-detail"
    | "manage_user"
    | "multi-menu_first_child"
    | "multi-menu_second_child_home"
    | "user-center"
  >;

  /**
   * the custom last level route key
   */
  export type CustomLastLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
    | "exception_403"
    | "exception_404"
    | "exception_500"
    | "document_project"
    | "document_project-link"
    | "document_react"
    | "document_vite"
    | "document_unocss"
    | "document_procomponents"
    | "document_antd"
    | "logout"
  >;

  /**
   * the single level route key
   */
  export type SingleLevelRouteKey = FirstLevelRouteKey & LastLevelRouteKey;

  /**
   * the custom single level route key
   */
  export type CustomSingleLevelRouteKey = CustomFirstLevelRouteKey & CustomLastLevelRouteKey;

  /**
   * the first level route key, but not the single level
  */
  export type FirstLevelRouteNotSingleKey = Exclude<FirstLevelRouteKey, SingleLevelRouteKey>;

  /**
   * the custom first level route key, but not the single level
   */
  export type CustomFirstLevelRouteNotSingleKey = Exclude<CustomFirstLevelRouteKey, CustomSingleLevelRouteKey>;

  /**
   * the center level route key
   */
  export type CenterLevelRouteKey = Exclude<GeneratedRouteKey, FirstLevelRouteKey | LastLevelRouteKey>;

  /**
   * the custom center level route key
   */
  export type CustomCenterLevelRouteKey = Exclude<CustomRouteKey, CustomFirstLevelRouteKey | CustomLastLevelRouteKey>;

  /**
   * the center level route key
   */
  type GetChildRouteKey<K extends RouteKey, T extends RouteKey = RouteKey> = T extends `${K}_${infer R}`
    ? R extends `${string}_${string}`
      ? never
      : T
    : never;

  /**
   * the single level route
   */
  type SingleLevelRoute<K extends SingleLevelRouteKey = SingleLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}$view.${K}`| `view.${LastLevelRouteKey}`|`layout.${RouteLayout}`;
        children?:ElegantConstRoute[] ;
        layout?:"base" | "blank"
      }
    : never;

  /**
   * the last level route
   */
  type LastLevelRoute<K extends GeneratedRouteKey> = K extends LastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `view.${K}`;
      }
    : never;
  
  /**
   * the center level route
   */
  type CenterLevelRoute<K extends GeneratedRouteKey> = K extends CenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the multi level route
   */
  type MultiLevelRoute<K extends FirstLevelRouteNotSingleKey = FirstLevelRouteNotSingleKey> = K extends string
    ? ElegantConstRoute & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}`| `view.${LastLevelRouteKey}`;
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
        layout?:"base" | "blank"
      }
    : never;
  
  /**
   * the custom first level route
   */
  type CustomSingleLevelRoute<K extends CustomFirstLevelRouteKey = CustomFirstLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `layout.${RouteLayout}$view.${LastLevelRouteKey}`| `view.${LastLevelRouteKey}`| `$view.${LastLevelRouteKey}`;
        layout?:"base" | "blank"
      }
    : never;

  /**
   * the custom last level route
   */
  type CustomLastLevelRoute<K extends CustomRouteKey> = K extends CustomLastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `view.${LastLevelRouteKey}`;
        layout?:"base" | "blank"
      }
    : never;

  /**
   * the custom center level route
   */
  type CustomCenterLevelRoute<K extends CustomRouteKey> = K extends CustomCenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the custom multi level route
   */
  type CustomMultiLevelRoute<K extends CustomFirstLevelRouteNotSingleKey = CustomFirstLevelRouteNotSingleKey> =
    K extends string
      ? ElegantConstRoute & {
          name: K;
          path: RouteMap[K];
          component: `layout.${RouteLayout}`| `view.${LastLevelRouteKey}`;
          children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
          layout?:"base" | "blank"
        }
      : never;

  /**
   * the custom route
   */
  type CustomRoute = CustomSingleLevelRoute | CustomMultiLevelRoute;

  /**
   * the generated route
   */
  type GeneratedRoute = SingleLevelRoute | MultiLevelRoute;

  /**
   * the elegant route
   */
  type ElegantRoute = GeneratedRoute | CustomRoute;
}
