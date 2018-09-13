import Vue from "vue";
import Router from "vue-router";
import interceptors from "@/util/interceptors";

import ProgressBar from "@/components/ProgressBar";

//views
const Home = () => import("@/components/views/Home");
const Verify = () => import("@/components/views/Verify");
const ResetPassword = () => import("@/components/views/ResetPassword");
const ErrorHandler = () => import("@/components/views/ErrorHandler");
const DiscourseSignIn = () => import("@/components/views/DiscourseSignIn");
const Account = () => import("@/components/views/account/Account");
const ViewPost = () => import("@/components/views/ViewPost");
const Security = () => import("@/components/views/account/Security");
const Personal = () => import("@/components/views/account/Personal");
const UpdateAccount = () => import("@/components/views/account/UpdateAccount");
const Streams = () => import("@/components/views/streams/StreamList");
const ManageApplications = () => import("@/components/views/applications/ManageApplications");
// const SingleStream = () => import ("@/components/views/streams/Stream");

const bar = (Vue.prototype.$bar = new Vue(ProgressBar).$mount());
document.body.appendChild(bar.$el);

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "*",
      component: Home
    },
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
      path: "/media/streams",
      name: "streams",
      component: Streams,
      meta: {
        title: "Media - Streams"
      }
    },
    // {
    //   path: "/media/stream/:stream",
    //   name: "stream",
    //   props: true,      
    //   component: SingleStream,
    //   meta: {
    //     title: "Stream"
    //   }
    // },
    {
      path: "/admin/manage/recruitment",
      name: "recruitment-applications",
      component: ManageApplications,
      meta: {
        title: "Admin - Manage Applications"
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
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    const title = to.params.slug ? to.params.slug.replace(/-/g, " ") : "";
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
