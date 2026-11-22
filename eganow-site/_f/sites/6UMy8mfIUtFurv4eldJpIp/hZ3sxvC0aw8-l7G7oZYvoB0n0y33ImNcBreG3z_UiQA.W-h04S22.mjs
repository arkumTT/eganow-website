import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";import{B as t,F as n,M as r,R as i,T as a,b as o,c as s,j as c,m as l,s as u,u as d,v as f,w as ee,x as p}from"./react.Qk7Bel28.mjs";import{a as te,r as ne,t as re,w as m}from"./motion.mi2rHIHk.mjs";import{A as ie,B as h,C as g,D as ae,E as oe,Et as _,K as v,M as y,Ot as b,R as x,a as S,bt as C,d as w,dt as se,gt as ce,ht as le,i as T,l as ue,m as E,pt as de,r as D,st as fe,ut as pe,wt as O,y as k,z as A}from"./framer.DW4Fr3Fy.mjs";import{_ as j,c as M,y as me}from"./OIjZRBmWDcIE2B6qgG1j.Ddm5ECbf.mjs";import{t as he}from"./default-utils.CapomXID.mjs";import{S as ge,_ as N,a as _e,b as ve,c as ye,i as be,o as xe,r as Se,s as P,v as Ce,x as we,y as Te}from"./shared-lib.DdyRA0lQ.mjs";import{n as Ee,t as F}from"./gfgQgKeyT.CIiNBYED.mjs";import{n as De,t as I}from"./NQi6x_aTn.D8YsV8oV.mjs";import{i as Oe,n as ke,r as Ae,t as je}from"./qcg0OEbTe.BoaHG5x_.mjs";import{i as Me,n as Ne,r as Pe,t as Fe}from"./TQyJKunPf.agftbenR.mjs";import{n as Ie,r as Le}from"./REdJyn7w3.CuT_v9DD.mjs";function L({type:e,url:t,html:n,zoom:r,radius:i,border:a,style:o={}}){return e===`url`&&t?/*#__PURE__*/ u(ze,{url:t,zoom:r,radius:i,border:a,style:o}):e===`html`&&n?/*#__PURE__*/ u(Ve,{html:n,style:o}):/*#__PURE__*/ u(Re,{style:o})}function Re({style:e}){return/*#__PURE__*/ u(`div`,{style:{minHeight:qe(e),...me,overflow:`hidden`,...e},children:/*#__PURE__*/ u(`div`,{style:V,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function ze({url:e,zoom:t,radius:n,border:r,style:i}){let a=!i.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let s=M(),[c,l]=f(s?void 0:!1);if(o(()=>{if(!s)return;let t=!0;l(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&l(e)}else{let e=await n.text();console.error(e),l(/* @__PURE__ */ Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),l(e)}),()=>{t=!1}},[e]),s&&a)return/*#__PURE__*/ u(R,{message:`URL embeds do not support auto height.`,style:i});if(!e.startsWith(`https://`))return/*#__PURE__*/ u(R,{message:`Unsupported protocol.`,style:i});if(c===void 0)return/*#__PURE__*/ u(Ke,{});if(c instanceof Error)return/*#__PURE__*/ u(R,{message:c.message,style:i});if(c===!0){let t=`Can’t embed ${e} due to its content security policy.`;return/*#__PURE__*/ u(R,{message:t,style:i})}return/*#__PURE__*/ u(`iframe`,{src:e,style:{...z,...i,...r,zoom:t,borderRadius:n,transformOrigin:`top center`},loading:`lazy`,fetchPriority:s?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:Be(s),allowFullScreen:!0,allow:`presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; clipboard-write`})}function Be(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function Ve({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return u(n||r?Ue:He,{html:e,...t})}return/*#__PURE__*/ u(We,{html:e,...t})}function He({html:e,style:n}){let r=p(),[i,a]=f(0);o(()=>{let e=r.current?.contentWindow;function n(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&a(r)}return t.addEventListener(`message`,n),e?.postMessage(`getEmbedHeight`,`*`),()=>{t.removeEventListener(`message`,n)}},[]);let s=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,c={...z,...n};return n.height||(c.height=i+`px`),/*#__PURE__*/ u(`iframe`,{ref:r,style:c,srcDoc:s})}function Ue({html:e,style:t}){let n=p();return o(()=>{let t=n.current;if(t)return t.innerHTML=e,Ge(t),()=>{t.innerHTML=``}},[e]),/*#__PURE__*/ u(`div`,{ref:n,style:{...B,...t}})}function We({html:e,style:t}){return/*#__PURE__*/ u(`div`,{style:{...B,...t},dangerouslySetInnerHTML:{__html:e}})}function Ge(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)Ge(t)}function Ke(){return/*#__PURE__*/ u(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...j,overflow:`hidden`},children:/*#__PURE__*/ u(`div`,{style:V,children:`Loading…`})})}function R({message:e,style:t}){return/*#__PURE__*/ u(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:qe(t),...j,overflow:`hidden`,...t},children:/*#__PURE__*/ u(`div`,{style:V,children:e})})}function qe(e){if(!e.height)return 200}var z,B,V;function Je(){return(Je=e((()=>{i(),s(),a(),v(),he(),ae(L,{type:{type:S.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:S.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:S.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:S.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:S.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:S.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),z={width:`100%`,height:`100%`,border:`none`},B={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},V={textAlign:`center`,minWidth:140}})))()}var Ye,H,U,Xe,W,G,Ze,Qe,$e,et,K,tt,nt,rt,it,q,at,J,Y,ot,st,ct,lt,X,ut,Z,dt,ft,pt,mt,ht,gt,_t,vt,Q,yt,bt,xt,St,$,Ct;function wt(){return(wt=e((()=>{s(),v(),re(),a(),Je(),Ee(),De(),Ce(),ye(),xe(),Oe(),Me(),ge(),Ie(),Ye=x(P),H=_(T),U=b(w),Xe=x(F),W=_(g),G=b(m.div),Ze=x(L),Qe=x(I),$e=x(N),et={e3kPypR9t:`(max-width: 809.98px)`,l_bdXqKW1:`(min-width: 1200px)`,OOM5SymzD:`(min-width: 810px) and (max-width: 1199.98px)`},K=()=>typeof document<`u`,tt=[],nt=`framer-r4IcK`,rt={e3kPypR9t:`framer-v-ijk48p`,l_bdXqKW1:`framer-v-y9otwy`,OOM5SymzD:`framer-v-4k6a9y`},it={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:-100},q={bounce:.2,delay:0,duration:.4,type:`spring`},at=(e,t,n)=>e&&t?`position`:n,J=(e,t)=>`translateX(-50%) ${t}`,Y=(...e)=>{for(let t of e)if(t&&typeof t==`string`)return t},ot={delay:0,duration:.5,ease:[.4,0,0,1],type:`tween`},st={opacity:0,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:-90},ct={opacity:0,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:-100},lt={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:1,duration:2,ease:[.4,0,0,1],type:`tween`},x:0,y:0},X={opacity:.001,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:30},ut={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:1.4,duration:2,ease:[.4,0,0,1],type:`tween`},x:0,y:0},Z={opacity:0,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:30},dt={delay:0,duration:.7,ease:[.4,0,0,1],type:`tween`},ft={opacity:0,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:35},pt={delay:.2,duration:.7,ease:[.4,0,0,1],type:`tween`},mt={delay:.4,duration:.7,ease:[.4,0,0,1],type:`tween`},ht={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:.6,duration:.7,ease:[.4,0,0,1],type:`tween`},x:0,y:0},gt={opacity:.001,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:50},_t={opacity:1,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,transition:{delay:.8,duration:.7,ease:[.4,0,0,1],type:`tween`},x:0,y:0},vt={opacity:.001,rotate:0,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:35},Q={Desktop:`l_bdXqKW1`,Phone:`e3kPypR9t`,Tablet:`OOM5SymzD`},yt=({value:e})=>de()?null:/*#__PURE__*/ u(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),bt=({height:e,id:t,width:n,...r})=>({...r,variant:Q[r.variant]??r.variant??`l_bdXqKW1`}),xt=/*#__PURE__*/ l(function(e,t){let i=p(null),a=t??i,o=ee(),{activeLocale:s,setLocale:l}=le(),f=fe(),{style:re,className:ae,layoutId:oe,variant:_,...v}=bt(e),y=r(()=>Le({},s),[s]);ce(y);let[b,x]=se(_,et,!1),S=ie(nt,Se,je,Fe,Te),de=()=>!K()||b!==`e3kPypR9t`,O=p(null),A=c(ue)?.isLayoutTemplate,j=!!c(te)?.transition?.layout,M=at(A,j),me=()=>!K()||b===`e3kPypR9t`,he=C(`qzjr3W1Qh`),ge=C(`RnJamOER1`),_e=p(null),ve=C(`QmFjle4IG`),ye=p(null);return pe({}),/*#__PURE__*/ u(ue.Provider,{value:{activeVariantId:b,humanReadableVariantMap:Q,primaryVariantId:`l_bdXqKW1`,variantClassNames:rt},children:/*#__PURE__*/ d(ne,{id:oe??o,children:[/*#__PURE__*/ u(yt,{value:`html body { background: var(--token-3854456b-5064-4658-bdfd-0b29f6aa355d, rgb(7, 12, 20)); }`}),/*#__PURE__*/ d(m.div,{...v,className:ie(S,`framer-y9otwy`,ae),ref:a,style:{...re},children:[de()&&/*#__PURE__*/ u(D,{height:90,width:`100vw`,y:0,children:/*#__PURE__*/ u(H,{__framer__animate:{transition:q},__framer__animateOnce:!1,__framer__enter:it,__framer__styleAppearEffectEnabled:!0,__framer__targets:[{offset:-50,ref:O,target:`animate`}],__framer__threshold:0,__perspectiveFX:!1,__targetOpacity:1,className:`framer-ym966s-container hidden-ijk48p`,layout:M,layoutScroll:!0,nodeId:`GGtZZfxpi`,rendersWithMotion:!0,scopeId:`REdJyn7w3`,transformTemplate:J,children:/*#__PURE__*/ u(k,{breakpoint:b,overrides:{OOM5SymzD:{variant:Y(`Sxp07P8M1`)}},children:/*#__PURE__*/ u(P,{hCEgBnfc4:`rgba(255, 255, 255, 0)`,height:`100%`,id:`GGtZZfxpi`,JCPrTw5gO:`fFSh2Yntw`,layoutId:`GGtZZfxpi`,lldNT05_A:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,LnWnqAu4e:`https://merchant.deveganowapi.com/register`,MGt7en8PG:`rgba(255, 255, 255, 0)`,PwSYZEbn6:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,r_egJzB9y:!0,RsQoK3u2e:`rgba(242, 250, 255, 0)`,style:{width:`100%`},SWszp5OyT:`fFSh2Yntw`,TgIyxTnqa:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,UyBcNAILP:`fFSh2Yntw`,variant:Y(`z_ubIf0I7`),wHIcezB1v:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,width:`100%`,WiNGKaCvG:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,ZL8xUZvtv:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`})})})}),/*#__PURE__*/ u(D,{height:90,width:`100vw`,y:0,children:/*#__PURE__*/ u(H,{__framer__animate:{transition:ot},__framer__animateOnce:!1,__framer__scrollDirection:{direction:`down`,target:st},__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-ik4n2z-container`,"data-framer-name":`Navigation`,layout:M,layoutScroll:!0,name:`Navigation`,nodeId:`q2h3sVMb6`,rendersWithMotion:!0,scopeId:`REdJyn7w3`,transformTemplate:J,children:/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{variant:Y(`b8d7uNsjb`)},OOM5SymzD:{variant:Y(`bll9Qhd7q`)}},children:/*#__PURE__*/ u(P,{hCEgBnfc4:`rgba(255, 255, 255, 0)`,height:`100%`,id:`q2h3sVMb6`,JCPrTw5gO:`fFSh2Yntw`,layoutId:`q2h3sVMb6`,lldNT05_A:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,LnWnqAu4e:`https://merchant.deveganowapi.com/register`,MGt7en8PG:`rgba(255, 255, 255, 0)`,name:`Navigation`,PwSYZEbn6:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,r_egJzB9y:!0,RsQoK3u2e:`rgba(242, 250, 255, 0)`,style:{width:`100%`},SWszp5OyT:`fFSh2Yntw`,TgIyxTnqa:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,UyBcNAILP:`fFSh2Yntw`,variant:Y(`FEJfqtKz9`),wHIcezB1v:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,width:`100%`,WiNGKaCvG:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,ZL8xUZvtv:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`})})})}),me()&&/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{height:90,width:`100vw`,y:0}},children:/*#__PURE__*/ u(D,{children:/*#__PURE__*/ u(H,{__framer__animate:{transition:q},__framer__animateOnce:!1,__framer__enter:ct,__framer__styleAppearEffectEnabled:!0,__framer__targets:[{offset:-50,ref:O,target:`animate`}],__framer__threshold:0,__perspectiveFX:!1,__targetOpacity:1,className:`framer-8mdccq-container hidden-y9otwy hidden-4k6a9y`,"data-framer-name":`Navigation`,layout:M,layoutScroll:!0,name:`Navigation`,nodeId:`RnZGq1SXm`,rendersWithMotion:!0,scopeId:`REdJyn7w3`,transformTemplate:J,children:/*#__PURE__*/ u(P,{hCEgBnfc4:`rgba(255, 255, 255, 0)`,height:`100%`,id:`RnZGq1SXm`,JCPrTw5gO:`fFSh2Yntw`,layoutId:`RnZGq1SXm`,lldNT05_A:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,LnWnqAu4e:`https://merchant.deveganowapi.com/register`,MGt7en8PG:`rgba(255, 255, 255, 0)`,name:`Navigation`,PwSYZEbn6:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,r_egJzB9y:!0,RsQoK3u2e:`rgba(242, 250, 255, 0)`,style:{width:`100%`},SWszp5OyT:`fFSh2Yntw`,TgIyxTnqa:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,UyBcNAILP:`fFSh2Yntw`,variant:Y(`pgHcewtYL`),wHIcezB1v:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,width:`100%`,WiNGKaCvG:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`,ZL8xUZvtv:`var(--token-47ef7e86-9ea6-47bf-9a30-889f143a325f, rgb(255, 255, 255))`})})})}),/*#__PURE__*/ u(m.section,{className:`framer-1tmiaxv`,"data-framer-name":`Contact`,id:he,layout:M,ref:O,children:/*#__PURE__*/ d(`div`,{className:`framer-lc7glr`,"data-framer-name":`Content`,children:[/*#__PURE__*/ d(`div`,{className:`framer-w6d365`,"data-framer-name":`BG Blur`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{background:{alt:``,fit:`fill`,intrinsicHeight:471.11112359129385,intrinsicWidth:468.88890131020287,loading:h((f?.y||0)+0+0+114+0+180+0),pixelHeight:424,pixelWidth:422,sizes:`420px`,src:`/_f/images/PBvpW9iBXWsz9gVkC6z99WDxCo.png`}},OOM5SymzD:{background:{alt:``,fit:`fill`,intrinsicHeight:471.11112359129385,intrinsicWidth:468.88890131020287,loading:h((f?.y||0)+0+0+164+180+0),pixelHeight:424,pixelWidth:422,sizes:`420px`,src:`/_f/images/PBvpW9iBXWsz9gVkC6z99WDxCo.png`}}},children:/*#__PURE__*/ u(U,{animate:lt,background:{alt:``,fit:`fill`,intrinsicHeight:471.11112359129385,intrinsicWidth:468.88890131020287,loading:h((f?.y||0)+0+0+184+180+0),pixelHeight:424,pixelWidth:422,sizes:`420px`,src:`/_f/images/PBvpW9iBXWsz9gVkC6z99WDxCo.png`},className:`framer-18kbdfo`,"data-framer-appear-id":`18kbdfo`,"data-framer-name":`Blur_2`,initial:X,optimized:!0})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{background:{alt:``,fit:`fill`,intrinsicHeight:317.77778619601423,intrinsicWidth:313.3333416338322,loading:h((f?.y||0)+0+0+114+0+180+0),pixelHeight:286,pixelWidth:282,sizes:`420px`,src:`/_f/images/nLeHcY6hTYnGZSbJxzCgB9CvFOw.png`}},OOM5SymzD:{background:{alt:``,fit:`fill`,intrinsicHeight:317.77778619601423,intrinsicWidth:313.3333416338322,loading:h((f?.y||0)+0+0+164+180+0),pixelHeight:286,pixelWidth:282,sizes:`420px`,src:`/_f/images/nLeHcY6hTYnGZSbJxzCgB9CvFOw.png`}}},children:/*#__PURE__*/ u(U,{animate:ut,background:{alt:``,fit:`fill`,intrinsicHeight:317.77778619601423,intrinsicWidth:313.3333416338322,loading:h((f?.y||0)+0+0+184+180+0),pixelHeight:286,pixelWidth:282,sizes:`420px`,src:`/_f/images/nLeHcY6hTYnGZSbJxzCgB9CvFOw.png`},className:`framer-3h2fij`,"data-framer-appear-id":`3h2fij`,"data-framer-name":`Blur_1`,initial:X,optimized:!0})})]}),/*#__PURE__*/ d(`div`,{className:`framer-15261jy`,"data-framer-name":`Heading`,children:[/*#__PURE__*/ d(`div`,{className:`framer-1g382su`,"data-framer-name":`Title`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{y:(f?.y||0)+0+0+114+0+0+0+0+0+0+0},OOM5SymzD:{y:(f?.y||0)+0+0+164+0+0+0+0+0+0}},children:/*#__PURE__*/ u(D,{height:31,y:(f?.y||0)+0+0+184+0+0+0+0+0+0,children:/*#__PURE__*/ u(H,{__framer__animate:{transition:dt},__framer__animateOnce:!0,__framer__enter:Z,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-1xm1rhc-container`,nodeId:`V64ApdREf`,rendersWithMotion:!0,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(F,{fpIYKhi7I:`LET'S CONNECT`,height:`100%`,id:`V64ApdREf`,layoutId:`V64ApdREf`,variant:Y(`D0b2Zo1HB`),width:`100%`})})})}),/*#__PURE__*/ u(W,{__framer__animate:{transition:pt},__framer__animateOnce:!0,__framer__enter:ft,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__fromCanvasComponent:!0,__perspectiveFX:!1,__targetOpacity:1,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`h2`,{className:`framer-styles-preset-ehi5dk`,"data-styles-preset":`DjrDyFYIF`,children:`We would love to hear from you`})}),className:`framer-e7tjtk`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),/*#__PURE__*/ u(W,{__framer__animate:{transition:mt},__framer__animateOnce:!0,__framer__enter:Z,__framer__styleAppearEffectEnabled:!0,__framer__threshold:0,__fromCanvasComponent:!0,__perspectiveFX:!1,__targetOpacity:1,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,dir:`auto`,style:{"--framer-text-alignment":`center`},children:`Have questions or just want to say hi? Send us a message below`})}),className:`framer-ivl3ff`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),/*#__PURE__*/ d(G,{animate:ht,className:`framer-kurnw0`,"data-framer-appear-id":`kurnw0`,"data-framer-name":`Form BG`,id:ge,initial:gt,optimized:!0,ref:_e,children:[/*#__PURE__*/ d(G,{animate:_t,className:`framer-p1w2yy`,"data-framer-appear-id":`p1w2yy`,"data-framer-name":`Description`,initial:vt,optimized:!0,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`Connect with us. We value your input. Together, we can create a better financial future. Let’s start today.`})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`Connect with us. We value your input. Together, we can create a better financial future. Let’s start today.`})}),className:`framer-ghljur`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})}),/*#__PURE__*/ d(`div`,{className:`framer-13lwc13`,"data-framer-name":`Information`,children:[/*#__PURE__*/ d(`div`,{className:`framer-2vo55g`,"data-framer-name":`Location`,children:[/*#__PURE__*/ d(`div`,{className:`framer-12vx9ee`,"data-framer-name":`Heading`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+114+0+0+319.1+40+0+0+180.5+0+0+0+0+5),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`20px`,src:`/_f/images/R0jNxudSb7xlKmkFlPV40stfCk.svg`}},OOM5SymzD:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+164+0+334.1+60+0+180.5+0+0+0+0+4),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`22px`,src:`/_f/images/R0jNxudSb7xlKmkFlPV40stfCk.svg`}}},children:/*#__PURE__*/ u(w,{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+184+0+374.1+80+0+184.5+0+0+0+0+3),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`24px`,src:`/_f/images/R0jNxudSb7xlKmkFlPV40stfCk.svg`},className:`framer-1pmreyz`,"data-framer-name":`Building Icon`})}),/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`h6`,{className:`framer-styles-preset-1251qf4`,"data-styles-preset":`TQyJKunPf`,dir:`auto`,style:{"--framer-text-color":`var(--token-c049abf4-7569-4ac3-887d-bef5b6657fab, rgb(33, 42, 64))`},children:`Location`})}),className:`framer-1c4rrat`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),/*#__PURE__*/ d(`div`,{className:`framer-1fo4nxb`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`No. 10  Parsnip Street`})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`No. 10  Parsnip Street`})}),className:`framer-4684sa`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`East Legon, Accra`})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`East Legon, Accra`})}),className:`framer-w4vkp4`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`Ghana`})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:`Ghana`})}),className:`framer-uh5p91`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})})]})]}),/*#__PURE__*/ d(`div`,{className:`framer-1rbudq0`,"data-framer-name":`Phone`,children:[/*#__PURE__*/ d(`div`,{className:`framer-xfc99o`,"data-framer-name":`Heading`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+114+0+0+319.1+40+0+0+180.5+0+512.5+0+0+5),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`20px`,src:`/_f/images/9XHJKytop2G8XbBxzu0zvEdAyg.svg`}},OOM5SymzD:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+164+0+334.1+60+0+180.5+0+517.5+0+0+4),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`22px`,src:`/_f/images/9XHJKytop2G8XbBxzu0zvEdAyg.svg`}}},children:/*#__PURE__*/ u(w,{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+184+0+374.1+80+0+184.5+0+525.5+0+0+3),pixelHeight:24,pixelWidth:24,positionX:`center`,positionY:`center`,sizes:`24px`,src:`/_f/images/9XHJKytop2G8XbBxzu0zvEdAyg.svg`},className:`framer-wo72jl`,"data-framer-name":`Phone Icon`})}),/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`h6`,{className:`framer-styles-preset-1251qf4`,"data-styles-preset":`TQyJKunPf`,style:{"--framer-text-color":`var(--token-c049abf4-7569-4ac3-887d-bef5b6657fab, rgb(33, 42, 64))`},children:`Phone`})}),className:`framer-1r9tqej`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,dir:`auto`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`tel:++233593900239`,motionChild:!0,nodeId:`szYJLXogj`,openInNewTab:!0,preserveParams:!1,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`+233 593 900 239`})})})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,dir:`auto`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`tel:++233593900239`,motionChild:!0,nodeId:`szYJLXogj`,openInNewTab:!0,preserveParams:!1,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`+233 593 900 239`})})})}),className:`framer-pc06p0`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,dir:`auto`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`tel:+233540102290`,motionChild:!0,nodeId:`nBQIJaLua`,openInNewTab:!0,preserveParams:!1,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`+233 540 102 290`})})})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,dir:`auto`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`tel:+233540102290`,motionChild:!0,nodeId:`nBQIJaLua`,openInNewTab:!0,preserveParams:!1,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`+233 540 102 290`})})})}),className:`framer-1ft1eqd`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})})]}),/*#__PURE__*/ d(`div`,{className:`framer-14ljjk9`,"data-framer-name":`Email`,children:[/*#__PURE__*/ d(`div`,{className:`framer-1louvz1`,"data-framer-name":`Heading`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+114+0+0+319.1+40+0+0+180.5+0+873.5+0+0+5),pixelHeight:18,pixelWidth:20,positionX:`center`,positionY:`center`,sizes:`20px`,src:`/_f/images/zu5Rs7uDSYrKixMB1cpDlaWdFY.svg`}},OOM5SymzD:{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+164+0+334.1+60+0+180.5+0+888.5+0+0+4),pixelHeight:18,pixelWidth:20,positionX:`center`,positionY:`center`,sizes:`22px`,src:`/_f/images/zu5Rs7uDSYrKixMB1cpDlaWdFY.svg`}}},children:/*#__PURE__*/ u(w,{background:{alt:``,fit:`fit`,loading:h((f?.y||0)+0+0+184+0+374.1+80+0+184.5+0+904.5+0+0+3),pixelHeight:18,pixelWidth:20,positionX:`center`,positionY:`center`,sizes:`24px`,src:`/_f/images/zu5Rs7uDSYrKixMB1cpDlaWdFY.svg`},className:`framer-z2i5mv`,"data-framer-name":`Mail Icon`})}),/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`h6`,{className:`framer-styles-preset-1251qf4`,"data-styles-preset":`TQyJKunPf`,style:{"--framer-text-color":`var(--token-c049abf4-7569-4ac3-887d-bef5b6657fab, rgb(33, 42, 64))`},children:`Email`})}),className:`framer-1a8ne3e`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),/*#__PURE__*/ d(`div`,{className:`framer-u3oyqv`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`mailto:info@eganow.com`,motionChild:!0,nodeId:`h242SDa4K`,openInNewTab:!0,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`info@eganow.com`})})})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`mailto:info@eganow.com`,motionChild:!0,nodeId:`h242SDa4K`,openInNewTab:!0,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`info@eganow.com`})})})}),className:`framer-15r0lyb`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-alignment":`center`,"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`mailto:sales@eganow.com`,motionChild:!0,nodeId:`YY1lvmk7F`,openInNewTab:!0,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`sales@eganow.com`})})})})}},children:/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`p`,{className:`framer-styles-preset-1p685yq`,"data-styles-preset":`qcg0OEbTe`,style:{"--framer-text-color":`var(--token-b32213de-a677-4f6d-93ea-f0b7678127df, rgb(72, 94, 121))`},children:/*#__PURE__*/ u(E,{href:`mailto:sales@eganow.com`,motionChild:!0,nodeId:`YY1lvmk7F`,openInNewTab:!0,relValues:[],scopeId:`REdJyn7w3`,smoothScroll:!1,children:/*#__PURE__*/ u(m.a,{className:`framer-styles-preset-4yo77n`,"data-styles-preset":`X7e4x7d10`,children:`sales@eganow.com`})})})}),className:`framer-txkpvu`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})})]})]})]})]}),/*#__PURE__*/ u(`div`,{className:`framer-ydh78z`,children:/*#__PURE__*/ u(D,{children:/*#__PURE__*/ u(T,{className:`framer-1ty6zh-container`,isModuleExternal:!0,nodeId:`ecLoXGnRu`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(L,{height:`100%`,html:`<html>
<head>
<meta charset="UTF-8">
<title>Send a message</title>
<link href="/_gf/fonts.css" rel="stylesheet">
<style>
@charset "UTF-8";
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend,caption, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
	margin: 0; padding: 0; border: 0; font: inherit; vertical-align: baseline;
}
body {
	background-attachment: fixed;
	color: #444444;
	font: 75%/1.3 Arial, Helvetica, sans-serif;
	margin: 0 auto;
}
input, input[type="text"], input[type="search"], isindex, textarea, button {
	outline: none; margin: 0 auto; padding: 5px 10px;
	-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;
}
img, a { border: 0px; outline: none; color: #3a6cae; text-decoration: none; }
img, a:hover { text-decoration: underline; }
.zf-flLeft { float: left; }
.zf-flRight { float: right; }
.zf-clearBoth, .zf-eclearBoth { clear: both; }
ol, ul { list-style: none outside none; }
.zf-normalText { font-size: 13px; line-height: 1.5; }
.zf-smallText { font-size: 0.9em; font-weight: normal; }
.zf-boldText, .zf-boldText a { font-weight: bold; text-decoration: none; }
.zf-italicText { font-style: italic; }
.zf-overAuto { overflow: auto; }
.zf-split { color: #8B9193; padding: 0 3px; }
.zf-backgroundBg { background: rgba(237, 239, 244, 1); }
.zf-templateWidth {
	margin: 0 auto; padding: 30px 20px;
	max-width: 800px; width: 100%; box-sizing: border-box;
}
.zf-templateWrapper {
	background: #fff;
	-webkit-box-shadow: 0px 0px 22px 0px #d8dfed;
	-moz-box-shadow: 0px 0px 22px 0px #d8dfed;
	box-shadow: 0px 0px 22px 0px #d8dfed;
	border-radius: 10px;
}
.zf-tempContDiv input[type="text"], .zf-tempContDiv textarea, .zf-tempContDiv .zf-pdfTextArea {
	background: #fff;
	border: 1px solid rgba(184, 187, 211, 1);
	border-radius: 10px;
	font-size: 15px;
	color: rgb(37, 44, 62);
	padding: 11px 10px 10px 10px;
	height: 40px;
	transition: 0.3s;
}
.zf-tempContDiv input[type="text"]::placeholder, .zf-tempContDiv textarea::placeholder {
	color: rgb(37, 44, 62); opacity: 0.5;
}
.zf-tempContDiv input[type="text"]:hover, .zf-tempContDiv textarea:hover {
	border: 1px solid rgba(184, 187, 211, 1);
}
.zf-tempContDiv input[type="text"]:focus, .zf-tempContDiv textarea:focus {
	border: 1px solid #2eb79f;
	box-shadow: 0px 0px 2px 0px #2eb79f;
}
.zf-tempContDiv textarea {
	min-height: 100px; height: 100px;
	font-family: Arial, Helvetica, sans-serif; padding: 10px;
}
.zf-errorMessage { font: 15px Arial, Helvetica, sans-serif; color: #f41033; padding-top: 10px; }
.zf-important { color: #ff0000 !important; padding: 0; font-size: 17px !important; margin-left: 2px; font-weight: bold; }
.zf-instruction { color: #465475; font-style: normal; font-size: 13px; overflow: visible !important; word-break: break-all; padding: 8px 0px 0px 0px; font-weight: 500; clear: both; }
.zf-symbols { padding: 0 5px; }
.zf-overflow { overflow: hidden; }
.zf-tempHeadBdr { margin: 0; padding: 0; overflow: hidden; }
.zf-tempHeadContBdr {
	background: #ffffff;
	border-bottom: 1px solid #ced3e0;
	margin: 0; padding: 28px 40px;
	border-radius: 10px 10px 0 0;
}
.zf-tempHeadContBdr .zf-frmTitle {
	color: #252c3e; margin: 0; padding: 0;
	font-size: 22px; font-weight: 500; text-align: center;
	font-family: 'Poppins', sans-serif;
}
.zf-tempHeadContBdr .zf-frmDesc {
	color: #667291; font-size: 18px; font-weight: 400;
	margin: 0; padding-top: 8px; text-align: center;
}
.zf-subContWrap { padding: 16px 0 16px 0; }
.zf-tempFrmWrapper { padding: 16px 40px 16px 40px; margin: 0; box-sizing: border-box; }
.zf-tempFrmWrapper .zf-tempContDiv { margin: 0; padding: 0; }
.zf-tempFrmWrapper .zf-labelName {
	font-weight: 500; font-size: 16px; color: #252c3e;
	padding-bottom: 8px; display: block;
	font-family: 'Manrope', sans-serif;
}
.zf-form-sBox {
	padding: 9px 10px 10px 5px;
	background: #fff;
	border: 1px solid rgba(184, 187, 211, 1);
	border-radius: 10px; font-size: 16px; height: 40px;
	transition: 0.3s; vertical-align: middle;
	position: relative; color: rgba(37, 44, 62, 1);
}
.zf-form-sBox:focus, .zf-form-sBox:focus:hover {
	border: 1px solid #2eb79f;
	box-shadow: 0px 0px 2px 0px #2eb79f;
	outline: none;
}
.zf-name .zf-tempContDiv span,
.zf-phone .zf-tempContDiv span,
.zf-time .zf-tempContDiv span { float: left; display: block; }
.zf-name .zf-tempContDiv span { margin-left: 0; }
.zf-name .zf-tempContDiv span.last { margin-right: 0; }
.zf-name .zf-tempContDiv span label { display: block; padding-top: 3px; }
.zf-name .zf-tempContDiv input[type="text"] { width: 100%; }
.zf-name .zf-tempContDiv span label,
.zf-phone .zf-tempContDiv span label {
	font-style: normal; font-size: 13px; overflow: visible !important;
	word-break: break-all; padding: 8px 0px 0px 0px;
	font-weight: 500; color: #252c3e; opacity: .8;
	display: block; padding-top: 3px;
}
.zf-phone .zf-tempContDiv .zf-symbols {
	display: block; margin: 9px 1%; width: 2%;
	text-align: center; padding: 0; padding-top: 3px;
}
/* Salutation stacked above Last Name */
.zf-name .zf-tempContDiv .zf-nameWrapper {
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	margin: 0;
	float: none;
}
.zf-salutation {
	display: block;
	float: none;
	margin: 0;
}
.zf-salutation select.zf-form-sBox {
	width: auto;
	display: block;
	margin: 0;
}
.zf-name .zf-nameWrapper > span:not(.zf-salutation) {
	display: block;
	float: none;
	width: 100%;
	margin: 0;
}
.zf-name .zf-nameWrapper > span:not(.zf-salutation) input[type="text"] {
	width: 100%;
	margin: 0;
}
/* Hide the "Last Name" placeholder label */
.zf-name .zf-nameWrapper > span:not(.zf-salutation) label { display: none !important; }
/* Full-width inputs */
.zf-large .zf-tempContDiv input[type="text"],
.zf-large .zf-tempContDiv textarea,
.zf-phwrapper input[type="text"] { width: 100%; }
/* Footer & Submit button */
.zf-fmFooter { padding: 20px 40px; text-align: left; }
button.zf-submitColor {
	background: #0657D0;
	border: none; color: #fff; cursor: pointer;
	font-size: 16px; font-weight: 500;
	padding: 10px 28px; border-radius: 12px;
	transition: background 0.2s;
}
button.zf-submitColor:hover { background: #2A7FFF; }
</style>
</head>
<body class="zf-backgroundBg">

<div class="zf-templateWidth">
  <form action='https://forms.zohopublic.com/egapassdevopsgm1/form/Contactwithphone/formperma/MjIApxhL1f9tmI2slJD96tvzD102v0u811Ft3yjea2k/htmlRecords/submit'
    name='form'
    method='POST'
    onSubmit='javascript:document.charset="UTF-8"; return zf_ValidateAndSubmit();'
    accept-charset='UTF-8'
    enctype='multipart/form-data'
    id='form'>

    <input type="hidden" name="zf_referrer_name" value="">
    <input type="hidden" name="zf_redirect_url" value="">
    <input type="hidden" name="zc_gad" value="">

    <div class="zf-templateWrapper">
      <ul class="zf-tempHeadBdr">
        <li class="zf-tempHeadContBdr">
          <h2 class="zf-frmTitle"><em>Send a message</em></h2>
          <p class="zf-frmDesc"></p>
          <div class="zf-clearBoth"></div>
        </li>
      </ul>

      <div class="zf-subContWrap zf-topAlign">
        <ul>

          <!-- Name: Salutation stacked above Last Name -->
          <div class="zf-tempFrmWrapper zf-name zf-namelarge">
            <label class="zf-labelName">Name <em class="zf-important"> *</em></label>
            <div class="zf-tempContDiv">
              <div class="zf-nameWrapper">
                <span class="zf-salutation">
                  <select class="zf-form-sBox" name="Name_Salutation" fieldType=7>
                    <option value="-Select-">-Select-</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </span>
                <span>
                  <input type="text" maxlength="255" name="Name_Last" fieldType=7 placeholder=""/>
                </span>
              </div>
              <p id="Name_error" class="zf-errorMessage" style="display:none;">Invalid value</p>
            </div>
            <div class="zf-clearBoth"></div>
          </div>

          <!-- Email -->
          <div class="zf-tempFrmWrapper zf-large">
            <label class="zf-labelName">Email <em class="zf-important"> *</em></label>
            <div class="zf-tempContDiv">
              <span>
                <input type="text" name="Email" checktype="c5" value="" maxlength="255" fieldType=9 placeholder=""/>
              </span>
              <p id="Email_error" class="zf-errorMessage" style="display:none;">Invalid value</p>
            </div>
            <div class="zf-clearBoth"></div>
          </div>

          <!-- Phone -->
          <div class="zf-tempFrmWrapper zf-large">
            <label class="zf-labelName">Phone</label>
            <div class="zf-tempContDiv zf-phonefld">
              <div class="zf-phwrapper zf-phNumber">
                <span>
                  <input type="text" compname="PhoneNumber" name="PhoneNumber_countrycode" maxlength="20" checktype="c7" value="" phoneFormat="1" isCountryCodeEnabled=false fieldType="11" id="international_PhoneNumber_countrycode" valType="number" phoneFormatType="1" placeholder=""/>
                </span>
                <div class="zf-clearBoth"></div>
              </div>
              <p id="PhoneNumber_error" class="zf-errorMessage" style="display:none;">Invalid value</p>
            </div>
            <div class="zf-clearBoth"></div>
          </div>

          <!-- Message -->
          <div class="zf-tempFrmWrapper zf-large">
            <label class="zf-labelName">Message</label>
            <div class="zf-tempContDiv">
              <span>
                <textarea name="MultiLine" checktype="c1" maxlength="65535" placeholder=""></textarea>
              </span>
              <p id="MultiLine_error" class="zf-errorMessage" style="display:none;">Invalid value</p>
            </div>
            <div class="zf-clearBoth"></div>
          </div>

        </ul>
      </div>

      <ul>
        <li class="zf-fmFooter">
          <button class="zf-submitColor">Submit</button>
        </li>
      </ul>
    </div>
  </form>
</div>

<script type="text/javascript">
// ---- validation.js ----
function zf_ValidateAndSubmit(){
	if(zf_CheckMandatory()){
		if(zf_ValidCheck()){
			if(isSalesIQIntegrationEnabled){ zf_addDataToSalesIQ(); }
			return true;
		}else{ return false; }
	}else{ return false; }
}
function zf_CheckMandatory(){
	for(i = 0; i < zf_MandArray.length; i++){
		var fieldObj = document.forms.form[zf_MandArray[i]];
		if(fieldObj){
			if(fieldObj.nodeName != null){
				if(fieldObj.nodeName == 'OBJECT'){
					if(!zf_MandatoryCheckSignature(fieldObj)){ zf_ShowErrorMsg(zf_MandArray[i]); return false; }
				}else if(((fieldObj.value).replace(/^\\s+|\\s+$/g,'')).length == 0){
					if(fieldObj.type == 'file'){ fieldObj.focus(); zf_ShowErrorMsg(zf_MandArray[i]); return false; }
					fieldObj.focus(); zf_ShowErrorMsg(zf_MandArray[i]); return false;
				}else if(fieldObj.nodeName == 'SELECT'){
					if(fieldObj.options[fieldObj.selectedIndex].value == '-Select-'){ fieldObj.focus(); zf_ShowErrorMsg(zf_MandArray[i]); return false; }
				}else if(fieldObj.type == 'checkbox' || fieldObj.type == 'radio'){
					if(fieldObj.checked == false){ fieldObj.focus(); zf_ShowErrorMsg(zf_MandArray[i]); return false; }
				}
			}else{
				var checkedValsCount = 0;
				var inpChoiceElems = fieldObj;
				for(var ii = 0; ii < inpChoiceElems.length; ii++){
					if(inpChoiceElems[ii].checked === true){ checkedValsCount++; }
				}
				if(checkedValsCount == 0){ inpChoiceElems[0].focus(); zf_ShowErrorMsg(zf_MandArray[i]); return false; }
			}
		}
	}
	return true;
}
function zf_ValidCheck(){
	var isValid = true;
	for(ind = 0; ind < zf_FieldArray.length; ind++){
		var fieldObj = document.forms.form[zf_FieldArray[ind]];
		if(fieldObj){
			if(fieldObj.nodeName != null){
				var checkType = fieldObj.getAttribute("checktype");
				if(checkType == "c2"){
					if(!zf_ValidateNumber(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c3"){
					if(!zf_ValidateCurrency(fieldObj)||!zf_ValidateDecimalLength(fieldObj,10)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c4"){
					if(!zf_ValidateDateFormat(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c5"){
					if(!zf_ValidateEmailID(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c6"){
					if(!zf_ValidateLiveUrl(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c7"){
					if(!zf_ValidatePhone(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}else if(checkType == "c8"){
					zf_ValidateSignature(fieldObj);
				}else if(checkType == "c9"){
					if(!zf_ValidateMonthYearFormat(fieldObj)){ isValid = false; fieldObj.focus(); zf_ShowErrorMsg(zf_FieldArray[ind]); return false; }
				}
			}
		}
	}
	return isValid;
}
function zf_ShowErrorMsg(uniqName){
	for(errInd = 0; errInd < zf_FieldArray.length; errInd++){
		var fldLinkName = zf_FieldArray[errInd].split('_')[0];
		document.getElementById(fldLinkName+"_error").style.display = 'none';
	}
	document.getElementById(uniqName.split('_')[0]+"_error").style.display = 'block';
}
function zf_ValidateNumber(elem){
	var validChars = "-0123456789";
	var numValue = elem.value.replace(/^\\s+|\\s+$/g,'');
	if(numValue != null && !numValue == ""){
		var result = true;
		if(numValue.charAt(0) == "-" && numValue.length == 1){ return false; }
		for(i = 0; i < numValue.length && result == true; i++){
			var strChar = numValue.charAt(i);
			if((strChar == "-") && (i != 0)){ return false; }
			if(validChars.indexOf(strChar) == -1){ result = false; }
		}
		return result;
	}else{ return true; }
}
function zf_ValidateDateFormat(inpElem){
	var dateValue = inpElem.value.replace(/^\\s+|\\s+$/g,'');
	if(dateValue == ""){ return true; }else{ return zf_DateRegex.test(dateValue); }
}
function zf_ValidateCurrency(elem){
	var validChars = "0123456789.";
	var numValue = elem.value.replace(/^\\s+|\\s+$/g,'');
	if(numValue.charAt(0) == '-'){ numValue = numValue.substring(1,numValue.length); }
	if(numValue != null && !numValue == ""){
		var result = true;
		for(i = 0; i < numValue.length && result == true; i++){
			if(validChars.indexOf(numValue.charAt(i)) == -1){ result = false; }
		}
		return result;
	}else{ return true; }
}
function zf_ValidateDecimalLength(elem,decimalLen){
	var numValue = elem.value;
	if(numValue.indexOf('.') >= 0){
		return numValue.substring(numValue.indexOf('.')+1).length <= decimalLen;
	}
	return true;
}
function zf_ValidateEmailID(elem){
	var check = 0;
	var emailValue = elem.value;
	if(emailValue != null && !emailValue == ""){
		var emailArray = emailValue.split(",");
		var emailExp = /^[\\w]([\\w\\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,22}$/;
		for(i = 0; i < emailArray.length; i++){
			if(!emailExp.test(emailArray[i].replace(/^\\s+|\\s+$/g,''))){ check = 1; }
		}
		return check == 0;
	}else{ return true; }
}
function zf_ValidateLiveUrl(elem){
	var urlValue = elem.value;
	if(urlValue !== null && typeof(urlValue) !== "undefined"){
		urlValue = urlValue.replace(/^\\s+|\\s+$/g,'');
		if(urlValue !== ""){
			var urlregex = new RegExp("^(((https|http|ftps|ftp)://[a-zA-Z\\\\d]+((_|-|@)[a-zA-Z\\\\d]+)*(\\\\.[a-zA-Z\\\\d]+((_|-|@)[a-zA-Z\\\\d]+)*)+(:\\\\d{1,5})?)|((w|W){3}(\\\\.[a-zA-Z\\\\d]+((_|-|@)[a-zA-Z\\\\d]+)*){2,}(:\\\\d{1,5})?)|([a-zA-Z\\\\d]+((_|-)[a-zA-Z\\\\d]+)*(\\\\.[a-zA-Z\\\\d]+((_|-)[a-zA-Z\\\\d]+)*)+(:\\\\d{1,5})?))(/[-\\\\w.?,:'/\\\\\\\\+=&;%$#@()!~]*)?$","i");
			return urlregex.test(urlValue);
		}
	}
	return true;
}
function zf_ValidatePhone(inpElem){
	var ZFPhoneRegex = {
		PHONE_INTE_ALL_REG: /^[+]{0,1}[()0-9-. ]+$/,
		PHONE_INTE_NUMERIC_REG: /^[0-9]+$/,
		PHONE_USA_REG: /^[0-9]+$/,
		PHONE_CONT_CODE_REG: /^[+][0-9]{1,4}$/
	};
	var phoneFormat = parseInt(inpElem.getAttribute("phoneFormat"));
	var fieldInpVal = inpElem.value.replace(/^\\s+|\\s+$/g,'');
	var toReturn = true;
	if(phoneFormat === 1){
		if(inpElem.getAttribute("valType") == 'code'){
			if(fieldInpVal != "" && !ZFPhoneRegex.PHONE_CONT_CODE_REG.test(fieldInpVal)){ return false; }
		}else{
			var IRexp = inpElem.getAttribute("phoneFormatType") == '2' ? ZFPhoneRegex.PHONE_INTE_NUMERIC_REG : ZFPhoneRegex.PHONE_INTE_ALL_REG;
			if(fieldInpVal != "" && !IRexp.test(fieldInpVal)){ return false; }
		}
		return toReturn;
	}else if(phoneFormat === 2){
		var InpMaxlength = inpElem.getAttribute("maxlength");
		if(fieldInpVal == ""){ return true; }
		return ZFPhoneRegex.PHONE_USA_REG.test(fieldInpVal) && fieldInpVal.length == InpMaxlength;
	}
}
function zf_ValidateSignature(objElem){
	var linkName = objElem.getAttribute("compname");
	var canvasElem = document.getElementById("drawingCanvas-"+linkName);
	var isValidSign = zf_IsSignaturePresent(objElem,linkName,canvasElem);
	document.getElementById("hiddenSignInput-"+linkName).value = isValidSign ? canvasElem.toDataURL() : "";
	return isValidSign;
}
function zf_MandatoryCheckSignature(objElem){
	var linkName = objElem.getAttribute("compname");
	return zf_IsSignaturePresent(objElem,linkName,document.getElementById("drawingCanvas-"+linkName));
}
function zf_IsSignaturePresent(objElem,linkName,canvasElem){
	var canvasData = canvasElem.getContext('2d').getImageData(0,0,canvasElem.width,canvasElem.height);
	for(var i = 0; i < canvasData.data.length; i++){
		if(canvasData.data[i]){ return true; }
	}
	return false;
}
function zf_FocusNext(elem,event){
	if(event.keyCode==9||event.keyCode==16||(event.keyCode>=37&&event.keyCode<=40)){ return; }
	var compname = elem.getAttribute("compname");
	var inpElemName = elem.getAttribute("name");
	if(inpElemName == compname+"_countrycode" && elem.value.length==3){ document.getElementsByName(compname+"_first")[0].focus(); }
	else if(inpElemName == compname+"_first" && elem.value.length==3){ document.getElementsByName(compname+"_second")[0].focus(); }
}
function zf_ValidateMonthYearFormat(inpElem){
	var v = inpElem.value.replace(/^\\s+|\\s+$/g,'');
	if(v == ""){ return true; }else{ return zf_MonthYearRegex.test(v); }
}
function zf_SetDateAndMonthRegexBasedOnDateFormate(dateFormat){
	var arr = [];
	var d, m;
	if(dateFormat==="dd-MMM-yyyy"){
		d="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$";
		m="^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="dd-MMMM-yyyy"){
		d="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";
		m="^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="MMMM-dd-yyyy"){
		d="^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](([0][1-9])|([1-2][0-9])|([3][0-1]))[-](?:(?:19|20)[0-9]{2})$";
		m="^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="dd/MM/yyyy"){
		d="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[\\/]([0][1-9]|1[012])[\\/](?:(?:19|20)[0-9]{2})$";
		m="^([0][1-9]|1[012])[\\/](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="dd-MM-yyyy"){
		d="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-]([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
		m="^([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="MM/dd/yyyy"){
		d="^([0][1-9]|1[012])[\\/](([0][1-9])|([1-2][0-9])|([3][0-1]))[\\/](?:(?:19|20)[0-9]{2})$";
		m="^([0][1-9]|1[012])[\\/](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="yyyy-MM-dd"){
		d="^(?:(?:19|20)[0-9]{2})[-]([0][1-9]|1[012])[-](([0][1-9])|([1-2][0-9])|([3][0-1]))$";
		m="^(?:(?:19|20)[0-9]{2})[-]([0][1-9]|1[012])$";
	}else if(dateFormat==="yyyy/MM/dd"){
		d="^(?:(?:19|20)[0-9]{2})[\\/]([0][1-9]|1[012])[\\/](([0][1-9])|([1-2][0-9])|([3][0-1]))$";
		m="^(?:(?:19|20)[0-9]{2})[\\/]([0][1-9]|1[012])$";
	}else if(dateFormat==="dd.MM.yyyy"){
		d="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[.]([0][1-9]|1[012])[.](?:(?:19|20)[0-9]{2})$";
		m="^([0][1-9]|1[012])[.](?:(?:19|20)[0-9]{2})$";
	}else if(dateFormat==="MM-dd-yyyy"){
		d="^([0][1-9]|1[012])[-](([0][1-9])|([1-2][0-9])|([3][0-1]))[-](?:(?:19|20)[0-9]{2})$";
		m="^([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
	}
	arr.push(d); arr.push(m);
	return arr;
}

// ---- salesiqintegration.js ----
function getSalesiqPhoneVal(inpElem){
	var fieldLinkName = inpElem.getAttribute("compname");
	var phoneFormat = inpElem.getAttribute("phoneFormat");
	var salesIQValue = "";
	if(phoneFormat === "1"){
		var isCodeEnabled = inpElem.getAttribute("isCountryCodeEnabled");
		salesIQValue = document.getElementById("international_"+fieldLinkName+"_countrycode").value;
		if(salesIQValue != null && salesIQValue !== "" && isCodeEnabled === "true"){
			salesIQValue = document.getElementById("international_"+fieldLinkName+"_countrycodeval").value + salesIQValue;
		}
	}else if(phoneFormat === "2"){
		salesIQValue = document.getElementById(fieldLinkName+"_countrycode").value
			+ document.getElementById(fieldLinkName+"_first").value
			+ document.getElementById(fieldLinkName+"_second").value;
	}
	return salesIQValue;
}
function replaceCustomVal(zfFieldValueMap){
	return function replacer(match,fieldName){
		var key = fieldName.replace('.','_');
		var value = "";
		if(zfFieldValueMap.hasOwnProperty(fieldName)){ value = zfFieldValueMap[fieldName]; }
		else if(zfFieldValueMap.hasOwnProperty(key)){ value = zfFieldValueMap[key]; }
		return value !== undefined ? value : match;
	};
}
function zf_addDataToSalesIQ(){
	var visitorinfo = {};
	var zfFieldValueMap = {};
	var elements = document.getElementById("form").elements;
	for(var elmIdx = 0; elmIdx < elements.length; elmIdx++){
		var inpElem = elements[elmIdx];
		var fieldType = inpElem.getAttribute("fieldType");
		if(fieldType==="1"||fieldType==="7"||fieldType==="9"||fieldType==="11"){
			if(fieldType==="11"){
				zfFieldValueMap[inpElem.getAttribute("compname")] = getSalesiqPhoneVal(inpElem);
			}else{
				zfFieldValueMap[inpElem.getAttribute("name")] = inpElem.value;
			}
		}
	}
	for(var siqIdx = 0; siqIdx < salesIQFieldsArray.length; siqIdx++){
		var salesIQObj = salesIQFieldsArray[siqIdx];
		var salesIQFieldName = salesIQObj.salesIQFieldName;
		var value = "";
		if(salesIQObj.hasOwnProperty("custom_val")){
			value = salesIQObj.custom_val.replace(/\\$\\{zf:([^}]+)\\}/g, replaceCustomVal(zfFieldValueMap));
		}else{
			if(zfFieldValueMap.hasOwnProperty(salesIQObj.formFieldName)){ value = zfFieldValueMap[salesIQObj.formFieldName]; }
			else if(zfFieldValueMap.hasOwnProperty(salesIQObj.fieldCompLinkName)){ value = zfFieldValueMap[salesIQObj.fieldCompLinkName]; }
		}
		if(salesIQFieldName==="Phone"){ visitorinfo.contactnumber=value; }
		else if(salesIQFieldName==="Email"){ visitorinfo.email=value; }
		else if(salesIQFieldName==="Name"){ visitorinfo.name=value; }
		else if(salesIQFieldName==="LastName"){ visitorinfo.lastname=value; }
		else if(salesIQFieldName==="FirstName"){ visitorinfo.firstname=value; }
		else if(salesIQFieldName==="Salutation"){ visitorinfo.salutation=value; }
	}
	parent.postMessage(JSON.stringify({type:'zoho.salesiq.apimessage',visitor:visitorinfo}),'*');
}

// ---- Form config ----
var dateAndMonthRegexFormateArray = zf_SetDateAndMonthRegexBasedOnDateFormate('dd-MMM-yyyy');
var zf_DateRegex = new RegExp(dateAndMonthRegexFormateArray[0]);
var zf_MonthYearRegex = new RegExp(dateAndMonthRegexFormateArray[1]);
var zf_MandArray = ["Name_Salutation","Name_Last","Email"];
var zf_FieldArray = ["Name_Salutation","Name_First","Name_Last","Email","PhoneNumber_countrycode","MultiLine"];
var isSalesIQIntegrationEnabled = true;
var salesIQFieldsArray = [
	{"formFieldName":"Email","formFieldType":9,"salesIQFieldName":"Email"},
	{"formFieldName":"PhoneNumber","formFieldType":11,"salesIQFieldName":"Phone"}
];
<\/script>

</body>
</html>`,id:`ecLoXGnRu`,layoutId:`ecLoXGnRu`,radius:`0px`,style:{height:`100%`,width:`100%`},type:`html`,url:``,width:`100%`,zoom:1})})})})]})]})}),/*#__PURE__*/ u(m.section,{className:`framer-1wf5twq`,"data-framer-name":`FAQ`,id:ve,layout:M,ref:ye,children:/*#__PURE__*/ d(`div`,{className:`framer-1hapoak`,children:[/*#__PURE__*/ u(g,{__fromCanvasComponent:!0,children:/*#__PURE__*/ u(n,{children:/*#__PURE__*/ u(`h2`,{className:`framer-styles-preset-ehi5dk`,"data-styles-preset":`DjrDyFYIF`,style:{"--framer-text-color":`var(--token-2ef2870a-5cab-4432-8521-74aeda00b2a6, rgb(14, 110, 255))`},children:`Frequently Asked Questions`})}),className:`framer-wvjmbw`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),/*#__PURE__*/ d(`div`,{className:`framer-s6i5jo`,children:[/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{width:`calc(${f?.width||`100vw`} - 70px)`,y:(f?.y||0)+0+1863.1+40+0+120+81.6+47+0},OOM5SymzD:{width:`calc(max(${f?.width||`100vw`} - 60px, 1px) - 30px)`,y:(f?.y||0)+0+2083.1+55+120+81.6+47+0}},children:/*#__PURE__*/ u(D,{height:63,width:`881px`,y:(f?.y||0)+0+2218.1+74+120+81.6+47+0,children:/*#__PURE__*/ u(T,{className:`framer-1oh7q7s-container`,nodeId:`XUZQigYZ3`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(I,{ePo1CFC_B:`What is Eganow?`,height:`100%`,id:`XUZQigYZ3`,layoutId:`XUZQigYZ3`,style:{width:`100%`},W7Hd6GXOr:`Eganow is a financial services platform and NOT a bank. Eganow aggregates financial services to enable you manage your money in one app, conveniently. You can send and receive money, buy airtime, pay bills, save, invest, buy pension, insurance, access credit and many more.`,width:`100%`})})})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{width:`calc(${f?.width||`100vw`} - 70px)`,y:(f?.y||0)+0+1863.1+40+0+120+81.6+47+102},OOM5SymzD:{width:`calc(max(${f?.width||`100vw`} - 60px, 1px) - 30px)`,y:(f?.y||0)+0+2083.1+55+120+81.6+47+102}},children:/*#__PURE__*/ u(D,{height:63,width:`881px`,y:(f?.y||0)+0+2218.1+74+120+81.6+47+102,children:/*#__PURE__*/ u(T,{className:`framer-iy9o99-container`,nodeId:`jGsFqXjTT`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(I,{ePo1CFC_B:`How do I start using Eganow?`,height:`100%`,id:`jGsFqXjTT`,layoutId:`jGsFqXjTT`,style:{width:`100%`},W7Hd6GXOr:`Download the Eganow App from the Android Playstore or Apple Appstore. You can also dial our short code *248# (in selected countries) or click the GET STARTED button on our website to register and start enjoying our services. What bills can I pay with Eganow?`,width:`100%`})})})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{width:`calc(${f?.width||`100vw`} - 70px)`,y:(f?.y||0)+0+1863.1+40+0+120+81.6+47+204},OOM5SymzD:{width:`calc(max(${f?.width||`100vw`} - 60px, 1px) - 30px)`,y:(f?.y||0)+0+2083.1+55+120+81.6+47+204}},children:/*#__PURE__*/ u(D,{height:63,width:`881px`,y:(f?.y||0)+0+2218.1+74+120+81.6+47+204,children:/*#__PURE__*/ u(T,{className:`framer-1jpt4hh-container`,nodeId:`oNTcvILsa`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(I,{ePo1CFC_B:`What bills can I pay with Eganow?`,height:`100%`,id:`oNTcvILsa`,layoutId:`oNTcvILsa`,style:{width:`100%`},W7Hd6GXOr:`With Eganow, you can pay school fees, TV subscriptions such as DSTV, airtime and data bundles, hospital bills, hotel bills, airline tickets, utility bills, religious dues such as tithes etc.`,width:`100%`})})})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{width:`calc(${f?.width||`100vw`} - 70px)`,y:(f?.y||0)+0+1863.1+40+0+120+81.6+47+306},OOM5SymzD:{width:`calc(max(${f?.width||`100vw`} - 60px, 1px) - 30px)`,y:(f?.y||0)+0+2083.1+55+120+81.6+47+306}},children:/*#__PURE__*/ u(D,{height:63,width:`881px`,y:(f?.y||0)+0+2218.1+74+120+81.6+47+306,children:/*#__PURE__*/ u(T,{className:`framer-152fzhz-container`,nodeId:`S3uG9AP2e`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(I,{ePo1CFC_B:`How can Eganow help me run my business?`,height:`100%`,id:`S3uG9AP2e`,layoutId:`S3uG9AP2e`,style:{width:`100%`},W7Hd6GXOr:`As a business, you can sign up as a merchant on the platform to enable you access tools for payments collection for international cards, mobile money and bank account. You may integrate your online shop with our payment gateway APIs or collect via USSD, QR payments, payment links or sign-up for POS service for in-person payments. The merchant portal also enables you to monitor collections and payouts in real-time amongst other financial services essential to your business.`,width:`100%`})})})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{width:`calc(${f?.width||`100vw`} - 70px)`,y:(f?.y||0)+0+1863.1+40+0+120+81.6+47+408},OOM5SymzD:{width:`calc(max(${f?.width||`100vw`} - 60px, 1px) - 30px)`,y:(f?.y||0)+0+2083.1+55+120+81.6+47+408}},children:/*#__PURE__*/ u(D,{height:63,width:`881px`,y:(f?.y||0)+0+2218.1+74+120+81.6+47+408,children:/*#__PURE__*/ u(T,{className:`framer-1fvvnox-container`,nodeId:`QogCtgh92`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(I,{ePo1CFC_B:`What Is Eganow Group?`,height:`100%`,id:`QogCtgh92`,layoutId:`QogCtgh92`,style:{width:`100%`},W7Hd6GXOr:`Managing Group contributions and crowdfunding campaigns is hard. That is why we created Eganow Group to enable you contribute and manage your contributions in a more easier, transparent and secure way. Eganow Group enables you to contribute towards events of friends and family, support a loved one by paying for their medical bills or education, or even give back to society.`,width:`100%`})})})})]})]})}),/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{y:(f?.y||0)+0+2718.1},OOM5SymzD:{y:(f?.y||0)+0+2977.1}},children:/*#__PURE__*/ u(D,{height:724,width:f?.width||`100vw`,y:(f?.y||0)+0+3232.7,children:/*#__PURE__*/ u(T,{className:`framer-1em2k7v-container`,layout:M,nodeId:`lM96xEGxy`,scopeId:`REdJyn7w3`,children:/*#__PURE__*/ u(k,{breakpoint:b,overrides:{e3kPypR9t:{variant:Y(`UVYTNhgpi`)},OOM5SymzD:{variant:Y(`rk8n09JhE`)}},children:/*#__PURE__*/ u(N,{height:`100%`,id:`lM96xEGxy`,layoutId:`lM96xEGxy`,style:{width:`100%`},variant:Y(`RoUQqqVu0`),width:`100%`})})})})})]}),/*#__PURE__*/ u(`div`,{id:`overlay`})]})})}),St=[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-r4IcK.framer-qoiwa7, .framer-r4IcK .framer-qoiwa7 { display: block; }`,`.framer-r4IcK.framer-y9otwy { align-content: center; align-items: center; background-color: var(--token-3854456b-5064-4658-bdfd-0b29f6aa355d, #070c14); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }`,`.framer-r4IcK .framer-ym966s-container { flex: none; height: auto; left: 50%; position: fixed; top: 0px; transform: translateX(-50%); width: 100%; z-index: 10; }`,`.framer-r4IcK .framer-ik4n2z-container, .framer-r4IcK .framer-8mdccq-container { flex: none; height: auto; left: 50%; position: fixed; top: 0px; transform: translateX(-50%); width: 100%; z-index: 9; }`,`.framer-r4IcK .framer-1tmiaxv { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 184px 60px 70px 60px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-lc7glr { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 75px; height: min-content; justify-content: center; max-width: 1018px; overflow: visible; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-w6d365 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; left: 83px; overflow: visible; padding: 0px; position: absolute; right: 83px; top: 180px; }`,`.framer-r4IcK .framer-18kbdfo { -webkit-filter: blur(100px); filter: blur(100px); flex: none; height: 420px; overflow: visible; position: relative; width: 420px; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-r4IcK .framer-3h2fij { -webkit-filter: blur(100px); aspect-ratio: 1 / 1; filter: blur(100px); flex: none; height: var(--framer-aspect-ratio-supported, 420px); overflow: visible; position: relative; width: 420px; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-r4IcK .framer-15261jy { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; max-width: 1228px; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-1g382su { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 30px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-1xm1rhc-container { flex: none; height: auto; position: relative; width: auto; }`,`.framer-r4IcK .framer-e7tjtk { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; position: relative; white-space: pre-wrap; width: 62%; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-ivl3ff { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; position: relative; white-space: pre-wrap; width: 60%; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-kurnw0 { align-content: flex-start; align-items: flex-start; background: linear-gradient(130deg, var(--token-de8ed926-7001-46f9-ba04-3723118d36f7, #f8f9fe) -9%, var(--token-c62bf750-2672-415c-a5a7-3001871b2106, rgb(200, 211, 227)) 100%); border-bottom-left-radius: 23px; border-bottom-right-radius: 23px; border-top-left-radius: 23px; border-top-right-radius: 23px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: center; overflow: hidden; padding: 80px 64px 80px 64px; position: relative; width: 100%; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-r4IcK .framer-p1w2yy { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 36px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1px; will-change: var(--framer-will-change-effect-override, transform); }`,`.framer-r4IcK .framer-ghljur, .framer-r4IcK .framer-4684sa, .framer-r4IcK .framer-w4vkp4, .framer-r4IcK .framer-uh5p91 { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-13lwc13 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 32px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-2vo55g, .framer-r4IcK .framer-1rbudq0, .framer-r4IcK .framer-14ljjk9 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-12vx9ee, .framer-r4IcK .framer-xfc99o, .framer-r4IcK .framer-1louvz1 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 15px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-1pmreyz, .framer-r4IcK .framer-wo72jl, .framer-r4IcK .framer-z2i5mv { flex: none; height: 24px; overflow: hidden; position: relative; width: 24px; will-change: var(--framer-will-change-filter-override, filter); }`,`.framer-r4IcK .framer-1c4rrat, .framer-r4IcK .framer-1r9tqej, .framer-r4IcK .framer-1a8ne3e { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: 1 0 0px; height: auto; position: relative; white-space: pre-wrap; width: 1px; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-1fo4nxb, .framer-r4IcK .framer-u3oyqv { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 4px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-pc06p0, .framer-r4IcK .framer-1ft1eqd { flex: none; height: auto; position: relative; white-space: pre-wrap; width: 80%; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-15r0lyb, .framer-r4IcK .framer-txkpvu { flex: none; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-ydh78z { align-content: flex-end; align-items: flex-end; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; border-top-left-radius: 16px; border-top-right-radius: 16px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 778px; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px 16px 0px 16px; position: relative; width: 426px; will-change: var(--framer-will-change-override, transform); }`,`.framer-r4IcK .framer-1ty6zh-container { flex: none; height: 100%; position: relative; width: 423px; }`,`.framer-r4IcK .framer-1wf5twq { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 74px 60px 74px 60px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-1hapoak { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 120px 15px 100px 15px; position: relative; width: 1px; }`,`.framer-r4IcK .framer-wvjmbw { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; max-width: 65%; position: relative; white-space: pre-wrap; width: auto; word-break: break-word; word-wrap: break-word; }`,`.framer-r4IcK .framer-s6i5jo { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 39px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 47px 0px 47px 0px; position: relative; width: 100%; }`,`.framer-r4IcK .framer-1oh7q7s-container, .framer-r4IcK .framer-iy9o99-container, .framer-r4IcK .framer-1jpt4hh-container, .framer-r4IcK .framer-152fzhz-container, .framer-r4IcK .framer-1fvvnox-container { flex: none; height: auto; position: relative; width: 881px; }`,`.framer-r4IcK .framer-1em2k7v-container { flex: none; height: auto; position: relative; width: 100%; }`,...be,...ke,...Ne,...ve,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-r4IcK.framer-y9otwy { width: 810px; } .framer-r4IcK .framer-1tmiaxv { padding: 164px 30px 55px 30px; } .framer-r4IcK .framer-lc7glr { gap: 45px; } .framer-r4IcK .framer-15261jy { gap: 15px; } .framer-r4IcK .framer-1g382su { gap: 25px; } .framer-r4IcK .framer-ivl3ff { width: 80%; } .framer-r4IcK .framer-kurnw0 { gap: 17px; padding: 60px 45px 60px 45px; width: 750px; } .framer-r4IcK .framer-p1w2yy { gap: 32px; } .framer-r4IcK .framer-13lwc13 { gap: 24px; } .framer-r4IcK .framer-12vx9ee, .framer-r4IcK .framer-xfc99o, .framer-r4IcK .framer-1louvz1 { gap: 12px; } .framer-r4IcK .framer-1pmreyz, .framer-r4IcK .framer-wo72jl { aspect-ratio: 1 / 1; height: var(--framer-aspect-ratio-supported, 22px); width: 22px; } .framer-r4IcK .framer-z2i5mv { aspect-ratio: 1 / 1; height: var(--framer-aspect-ratio-supported, 22px); order: 0; width: 22px; } .framer-r4IcK .framer-1a8ne3e { order: 1; } .framer-r4IcK .framer-ydh78z { height: 775px; padding: 24px 16px 2px 16px; width: 424px; } .framer-r4IcK .framer-1ty6zh-container { height: 778px; width: 433px; } .framer-r4IcK .framer-1wf5twq { padding: 55px 30px 55px 30px; } .framer-r4IcK .framer-1hapoak { height: 784px; } .framer-r4IcK .framer-wvjmbw { max-width: unset; width: 597px; } .framer-r4IcK .framer-1oh7q7s-container, .framer-r4IcK .framer-iy9o99-container, .framer-r4IcK .framer-1jpt4hh-container, .framer-r4IcK .framer-152fzhz-container, .framer-r4IcK .framer-1fvvnox-container { width: 100%; }}`,`@media (max-width: 809.98px) { .framer-r4IcK.framer-y9otwy { width: 390px; } .framer-r4IcK .framer-1tmiaxv { flex-direction: column; padding: 114px 20px 40px 20px; } .framer-r4IcK .framer-lc7glr { gap: 35px; } .framer-r4IcK .framer-15261jy { gap: 15px; } .framer-r4IcK .framer-1g382su { gap: 20px; } .framer-r4IcK .framer-e7tjtk { width: 85%; } .framer-r4IcK .framer-ivl3ff, .framer-r4IcK .framer-pc06p0, .framer-r4IcK .framer-1ft1eqd, .framer-r4IcK .framer-1oh7q7s-container, .framer-r4IcK .framer-iy9o99-container, .framer-r4IcK .framer-1jpt4hh-container, .framer-r4IcK .framer-152fzhz-container, .framer-r4IcK .framer-1fvvnox-container { width: 100%; } .framer-r4IcK .framer-kurnw0 { flex-direction: column; gap: 40px; height: 1390px; justify-content: flex-start; padding: 40px 32px 40px 32px; } .framer-r4IcK .framer-p1w2yy { flex: none; gap: 32px; order: 1; width: 100%; } .framer-r4IcK .framer-13lwc13 { gap: 24px; } .framer-r4IcK .framer-2vo55g, .framer-r4IcK .framer-1rbudq0 { align-content: center; align-items: center; gap: 5px; } .framer-r4IcK .framer-12vx9ee, .framer-r4IcK .framer-xfc99o, .framer-r4IcK .framer-1louvz1 { gap: 10px; } .framer-r4IcK .framer-1pmreyz, .framer-r4IcK .framer-wo72jl { aspect-ratio: 1 / 1; height: var(--framer-aspect-ratio-supported, 20px); width: 20px; } .framer-r4IcK .framer-1c4rrat, .framer-r4IcK .framer-1r9tqej { flex: none; white-space: pre; width: auto; } .framer-r4IcK .framer-4684sa, .framer-r4IcK .framer-w4vkp4, .framer-r4IcK .framer-uh5p91 { width: 83%; } .framer-r4IcK .framer-14ljjk9 { gap: 5px; } .framer-r4IcK .framer-z2i5mv { aspect-ratio: 1 / 1; height: var(--framer-aspect-ratio-supported, 20px); order: 0; width: 20px; } .framer-r4IcK .framer-1a8ne3e { flex: none; order: 1; white-space: pre; width: auto; } .framer-r4IcK .framer-ydh78z { flex: 1 0 0px; height: 1px; order: 2; width: 293px; } .framer-r4IcK .framer-1ty6zh-container { height: 801px; width: 290px; } .framer-r4IcK .framer-1wf5twq { flex-direction: column; padding: 40px 20px 25px 20px; } .framer-r4IcK .framer-1hapoak { flex: none; height: 790px; width: 100%; } .framer-r4IcK .framer-wvjmbw { max-width: unset; width: 298px; }}`],$=O(xt,St,`framer-r4IcK`),$.displayName=`Pricing`,$.defaultProps={height:3325,width:1200},oe($,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`/_f/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`/_f/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`/_f/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`/_f/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`/_f/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`/_f/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`/_f/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`}]},...Ye,...Xe,...Ze,...Qe,...$e,...A(_e),...A(Ae),...A(Pe),...A(we)],{supportsExplicitInterCodegen:!0}),$.loader={load:(e,t)=>(t.locale,Promise.allSettled([y(P,{},t),y(F,{},t),y(I,{},t),y(N,{},t)]))},Ct={exports:{default:{type:`reactComponent`,name:`FramerREdJyn7w3`,slots:[],annotations:{framerDisplayContentsDiv:`false`,framerAutoSizeImages:`true`,framerContractVersion:`1`,framerLayoutTemplateFlowEffect:`true`,framerColorSyntax:`true`,framerComponentViewportWidth:`true`,framerIntrinsicHeight:`3325`,framerScrollSections:`{"qzjr3W1Qh":{"pattern":":qzjr3W1Qh","name":"contact"},"RnJamOER1":{"pattern":":RnJamOER1","name":"contact-form"},"QmFjle4IG":{"pattern":":QmFjle4IG","name":"faq"}}`,framerImmutableVariables:`true`,framerIntrinsicWidth:`1200`,framerAcceptsLayoutTemplate:`true`,framerResponsiveScreen:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"OOM5SymzD":{"layout":["fixed","auto"]},"e3kPypR9t":{"layout":["fixed","auto"]}}}`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}})))()}wt();export{Ct as __FramerMetadata__,$ as default,tt as queryParamNames};
//# sourceMappingURL=hZ3sxvC0aw8-l7G7oZYvoB0n0y33ImNcBreG3z_UiQA.W-h04S22.mjs.map