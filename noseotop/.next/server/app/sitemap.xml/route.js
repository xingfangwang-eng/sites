"use strict";(()=>{var e={};e.id=717,e.ids=[717],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9178:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>c,patchFetch:()=>x,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m});var o={};r.r(o),r.d(o,{GET:()=>p});var a=r(9303),i=r(8716),s=r(670),n=r(8597);let p=()=>{let e="https://noseotop.vercel.app",t=n.map(t=>({url:`${e}/solution/${t.slug}`,lastModified:new Date,changeFrequency:"monthly",priority:.8})),r=[{url:e,lastModified:new Date,changeFrequency:"weekly",priority:1},...t];return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${r.map(e=>`
    <url>
      <loc>${e.url}</loc>
      <lastmod>${e.lastModified.toISOString()}</lastmod>
      <changefreq>${e.changeFrequency}</changefreq>
      <priority>${e.priority}</priority>
    </url>
  `).join("")}
</urlset>`,{headers:{"Content-Type":"application/xml"}})},l=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"E:\\kaifa\\saas\\noseotop\\app\\sitemap.xml\\route.ts",nextConfigOutput:"export",userland:o}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:d}=l,c="/sitemap.xml/route";function x(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}},9303:(e,t,r)=>{e.exports=r(517)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[948,597],()=>r(9178));module.exports=o})();