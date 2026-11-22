import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";import{B as t,R as n,T as r,b as i,c as a,s as o,v as s,x as c}from"./react.Qk7Bel28.mjs";import{D as l,K as u,a as d}from"./framer.DW4Fr3Fy.mjs";import{_ as f,c as p,y as m}from"./OIjZRBmWDcIE2B6qgG1j.Ddm5ECbf.mjs";import{t as h}from"./default-utils.CapomXID.mjs";function g({type:e,url:t,html:n,zoom:r=1,radius:i=0,border:a={width:0,color:`rgba(200,200,200,0.5)`},style:s={}}){return e===`url`&&t?/*#__PURE__*/ o(v,{url:t,zoom:r,radius:i,border:a,style:s}):e===`html`&&n?/*#__PURE__*/ o(b,{html:n,style:s}):/*#__PURE__*/ o(_,{style:s})}function _({style:e}){return/*#__PURE__*/ o(`div`,{style:{minHeight:D(e),...m,overflow:`hidden`,...e},children:/*#__PURE__*/ o(`div`,{style:A,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function v({url:e,zoom:t,radius:n,border:r,style:a}){let c=!a.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let l=p(),[u,d]=s(l?void 0:!1);if(i(()=>{if(!l)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(/* @__PURE__ */ Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),l&&c)return/*#__PURE__*/ o(E,{message:`URL embeds do not support auto height.`,style:a});if(!e.startsWith(`https://`))return/*#__PURE__*/ o(E,{message:`Unsupported protocol.`,style:a});if(u===void 0)return/*#__PURE__*/ o(T,{});if(u instanceof Error)return/*#__PURE__*/ o(E,{message:u.message,style:a});if(u===!0){let t=`Can’t embed ${e} due to its content security policy.`;return/*#__PURE__*/ o(E,{message:t,style:a})}return/*#__PURE__*/ o(`iframe`,{src:e,style:{...O,...a,zoom:t,borderRadius:n,border:`${r.width}px solid ${r.color}`,transformOrigin:`top center`},loading:`lazy`,fetchPriority:l?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:y(l)})}function y(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function b({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return o(n||r?S:x,{html:e,...t})}return/*#__PURE__*/ o(C,{html:e,...t})}function x({html:e,style:n}){let r=c(),[a,l]=s(0);i(()=>{let e=r.current?.contentWindow;function n(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return t.addEventListener(`message`,n),e?.postMessage(`getEmbedHeight`,`*`),()=>{t.removeEventListener(`message`,n)}},[]);let u=`
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
`,d={...O,...n};return n.height||(d.height=a+`px`),/*#__PURE__*/ o(`iframe`,{ref:r,style:d,srcDoc:u})}function S({html:e,style:t}){let n=c();return i(()=>{let t=n.current;if(t)return t.innerHTML=e,w(t),()=>{t.innerHTML=``}},[e]),/*#__PURE__*/ o(`div`,{ref:n,style:{...k,...t}})}function C({html:e,style:t}){return/*#__PURE__*/ o(`div`,{style:{...k,...t},dangerouslySetInnerHTML:{__html:e}})}function w(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)w(t)}function T(){return/*#__PURE__*/ o(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...f,overflow:`hidden`},children:/*#__PURE__*/ o(`div`,{style:A,children:`Loading…`})})}function E({message:e,style:t}){return/*#__PURE__*/ o(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:D(t),...f,overflow:`hidden`,...t},children:/*#__PURE__*/ o(`div`,{style:A,children:e})})}function D(e){if(!e.height)return 200}var O,k,A;function j(){return(j=e((()=>{n(),a(),r(),u(),h(),l(g,{type:{type:d.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:d.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:d.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:d.Object,optional:!0,hidden(e){return e.type!==`url`},controls:{width:{title:`Width`,type:d.Number,defaultValue:1,min:0,step:1,displayStepper:!0},color:{title:`Color`,type:d.Color,defaultValue:`rgba(200,200,200,0.5)`}},defaultValue:{width:1,color:`rgba(200,200,200,0.5)`}},radius:{type:d.Number,title:`Radius`,defaultValue:0,min:0,max:100,step:1,displayStepper:!0,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:d.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),O={width:`100%`,height:`100%`,border:`none`},k={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},A={textAlign:`center`,minWidth:140}})))()}export{j as n,g as t};
//# sourceMappingURL=Embed.DwxO4JWv.mjs.map