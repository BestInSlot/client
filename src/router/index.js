import Vue from "vue";
import Router from "vue-router";
import interceptors from "@/util/interceptors";

import ProgressBar from "@/components/ProgressBar";

//views
import Home from "@/components/views/Home";
const Verify = () => import("@/components/views/Verify");
const ResetPassword = () => import("@/components/views/ResetPassword");
const ErrorHandler = () => import("@/components/views/ErrorHandler");
const DiscourseSignIn = () => import("@/components/views/DiscourseSignIn");
const Account = () => import("@/components/views/Account");
const ViewPost = () => import("@/components/views/ViewPost");
const Security = () => import("@/components/views/Security");
const Personal = () => import("@/components/views/Personal1");
const UpdateAccount = () => import("@/components/views/UpdateAccount1");

const bar = (Vue.prototype.$bar = new Vue(ProgressBar).$mount());
document.body.appendChild(bar.$el);

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "Best In Slot"
      }
    },
    {
      path: "/page/:page",
      props: true,
      component: Home,
      meta: {
        title: "Best In Slot"
      }
    },
    {
      path: "/news/:id/:slug",
      name: "Post",
      component: ViewPost
    },
    {
      path: "/verify/:code",
      name: "verify",
      component: Verify,
      meta: {
        title: "Account activated.",
        auth: true
      }
    },
    {
      path: "/account",
      component: Account,
      redirect: Personal,
      meta: {
        title: "Best In Slot - My Account",
        auth: true
      },
      children: [
        {
          path: "",
          name: "personal",
          component: Personal,
          meta: {
            title: "My Account - Personal",
            auth: true
          }
        },
        {
          path: "personal",
          component: Personal,
          meta: {
            title: "My Account - Personal",
            auth: true
          }
        },
        {
          path: "personal/verify/:code",
          component: UpdateAccount,
          meta: {
            title: "My Account - Verification",
            auth: true
          }
        },
        {
          path: "security",
          component: Security,
          meta: {
            title: "My Account - Security",
            auth: true
          }
        }
      ]
    },
    {
      path: "/sso",
      component: DiscourseSignIn,
      meta: {
        title: "Signing into discourse...",
        auth: true
      }
    },
    {
      path: "/reset-password",
      component: ResetPassword,
      meta: {
        auth: false
      }
    },
    {
      path: "/error/:status",
      component: ErrorHandler,
      props: true,
      meta: {
        title: "Error!"
      }
    },
    {
      path: "*",
      redirect: Home
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    const title = to.params.slug.replace(/-/g, " ");
    document.title = title;
  }
  next();
});

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });
    bar.start();
    return Promise.all(activated)
      .then(() => {
        bar.finish();
        next();
      })
      .catch(next);
  });
});

export default router;
