const n=(n,e,...t)=>({t:n,o:e,i:t.filter((n=>!1!==n)),key:e&&e.key}),e=n=>n.children,t=(t,c,o=c.l||(c.l={}))=>r(n(e,{},[t]),c,o),r=(n,e,t,o)=>{if(n.pop)return c(e,n,t);if(n.t.call){n.u=t.u||{};const c={children:n.i,...n.o},i=n.t(c,n.u,(t=>(Object.assign(n.u,t),r(n,e,n))));return n._=r(i,e,t&&t._||{},o),e.l=n}{const r=t.dom||(n.t?document.createElement(n.t):new Text(n.o));if(n.o!=t.o)if(n.t){const{key:e,ref:c,...o}=n.o;c&&(c.current=r);for(let n in o){const e=o[n];if("style"!==n||e.trim)e!=(t.o&&t.o[n])&&(n in r||(n=n.toLowerCase())in r?r[n]=e:null!=e?r.setAttribute(n,e):r.removeAttribute(n));else for(const n in e)r.style[n]=e[n]}}else r.data=n.o;return c(r,n.i,t),t.dom&&null==o||e.insertBefore(n.dom=r,e.childNodes[o+1]||null),e.l=Object.assign(t,n)}},c=(e,t,c)=>{const i=c.h||[];return c.h=t.concat.apply([],t).map(((t,c)=>{const o=t.i?t:n("",""+t),l=i.find(((n,e)=>n&&n.t==o.t&&n.key==o.key&&(e==c&&(c=void 0),i[e]=0,n)))||{};return r(o,e,l,c)})),i.map((n=>o(n))),c};function o(n){const{i:e=[],h:t=[],_:r}=n;e.concat(r).map((n=>n&&o(n))),t.concat(n).map((n=>n&&n.dom&&n.dom.remove()))}export{n as h,e as Fragment,t as render};