"use strict";(self.webpackChunkfft_browser_test=self.webpackChunkfft_browser_test||[]).push([[13],{3013:function(A,e,r){r.r(e);var n={},t={exports:n},i=function(){var A="undefined"!==typeof document&&document.currentScript?document.currentScript.src:void 0;return function(e){var r,n;(e="undefined"!=typeof(e=e||{})?e:{}).ready=new Promise((function(A,e){r=A,n=e}));var t,i=Object.assign({},e),a=[],f="";"undefined"!=typeof document&&document.currentScript&&(f=document.currentScript.src),A&&(f=A),f=0!==f.indexOf("blob:")?f.substr(0,f.replace(/[?#].*/,"").lastIndexOf("/")+1):"";e.print||console.log.bind(console);var o,u=e.printErr||console.warn.bind(console);Object.assign(e,i),i=null,e.arguments&&(a=e.arguments),e.thisProgram&&e.thisProgram,e.quit&&e.quit,e.wasmBinary&&(o=e.wasmBinary);e.noExitRuntime;var c,s={Memory:function(A){this.buffer=new ArrayBuffer(65536*A.initial)},Module:function(A){},Instance:function(A,e){this.exports=function(A){for(var e,r=new Uint8Array(123),n=25;n>=0;--n)r[48+n]=52+n,r[65+n]=n,r[97+n]=26+n;function t(A,e,n){for(var t,i,a=0,f=e,o=n.length,u=e+(3*o>>2)-("="==n[o-2])-("="==n[o-1]);a<o;a+=4)t=r[n.charCodeAt(a+1)],i=r[n.charCodeAt(a+2)],A[f++]=r[n.charCodeAt(a)]<<2|t>>4,f<u&&(A[f++]=t<<4|i>>2),f<u&&(A[f++]=i<<6|r[n.charCodeAt(a+3)])}r[43]=62,r[47]=63;var i=new ArrayBuffer(16),a=new Int32Array(i),f=(new Float32Array(i),new Float64Array(i));function o(A){return a[A]}function u(A,e){a[A]=e}function c(){return f[0]}function s(A){f[0]=A}return function(A){var r=A.a.buffer,n=new Int8Array(r),i=(new Int16Array(r),new Int32Array(r)),a=new Uint8Array(r),f=(new Uint16Array(r),new Uint32Array(r)),b=(new Float32Array(r),new Float64Array(r)),k=Math.imul,l=(Math.fround,Math.abs),w=(Math.clz32,Math.min,Math.max,Math.floor),g=(Math.ceil,Math.trunc,Math.sqrt,A.abort),d=A.b,h=A.c,p=5247264;function m(A){var e,r=0,n=0,t=0,o=0,u=0,c=0,s=0,b=0,k=0,l=0;p=e=p-16|0;A:{e:{r:{n:{t:{i:{a:{f:{o:{u:{c:{if((A|=0)>>>0<=244){if(3&(r=(o=i[970])>>>(n=(c=A>>>0<11?16:A+11&-8)>>>3|0)|0)){A=(u=i[(r=(t=n+(1&(-1^r))|0)<<3)+3928>>2])+8|0,(0|(n=i[u+8>>2]))!=(0|(r=r+3920|0))?(i[n+12>>2]=r,i[r+8>>2]=n):i[970]=F(t)&o,r=t<<3,i[u+4>>2]=3|r,i[(r=r+u|0)+4>>2]=1|i[r+4>>2];break A}if((l=i[972])>>>0>=c>>>0)break c;if(r){n=A=(r=(0-(A=(0-(A=2<<n)|A)&r<<n)&A)-1|0)>>>12&16,n|=A=(r=r>>>A|0)>>>5&8,n|=A=(r=r>>>A|0)>>>2&4,k=i[(A=(n=((n|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)|0)<<3)+3928>>2],(0|(r=i[k+8>>2]))!=(0|(A=A+3920|0))?(i[r+12>>2]=A,i[A+8>>2]=r):(o=F(n)&o,i[970]=o),A=k+8|0,i[k+4>>2]=3|c,u=(r=n<<3)-c|0,i[(t=c+k|0)+4>>2]=1|u,i[r+k>>2]=u,l&&(n=3920+((r=l>>>3|0)<<3)|0,k=i[975],(r=1<<r)&o?r=i[n+8>>2]:(i[970]=r|o,r=n),i[n+8>>2]=k,i[r+12>>2]=k,i[k+12>>2]=n,i[k+8>>2]=r),i[975]=t,i[972]=u;break A}if(!(s=i[971]))break c;for(n=A=(r=(0-s&s)-1|0)>>>12&16,n|=A=(r=r>>>A|0)>>>5&8,n|=A=(r=r>>>A|0)>>>2&4,r=i[4184+(((n|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)<<2)>>2],t=(-8&i[r+4>>2])-c|0,n=r;(A=i[n+16>>2])||(A=i[n+20>>2]);)t=(u=(n=(-8&i[A+4>>2])-c|0)>>>0<t>>>0)?n:t,r=u?A:r,n=A;if(b=i[r+24>>2],(0|(u=i[r+12>>2]))!=(0|r)){A=i[r+8>>2],i[A+12>>2]=u,i[u+8>>2]=A;break e}if(!(A=i[(n=r+20|0)>>2])){if(!(A=i[r+16>>2]))break u;n=r+16|0}for(;k=n,u=A,(A=i[(n=A+20|0)>>2])||(n=u+16|0,A=i[u+16>>2]););i[k>>2]=0;break e}if(c=-1,!(A>>>0>4294967231)&&(c=-8&(A=A+11|0),b=i[971])){t=0-c|0,o=0,c>>>0<256||(o=31,c>>>0>16777215||(A=A>>>8|0,A<<=k=A+1048320>>>16&8,o=28+((A=((A<<=n=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|n|k)|0)<<1|c>>>A+21&1)|0));s:{b:{if(n=i[4184+(o<<2)>>2])for(A=0,r=c<<(31==(0|o)?0:25-(o>>>1|0)|0);;){if(!((k=(s=-8&i[n+4>>2])-c|0)>>>0>=t>>>0)&&(t=k,u=n,(0|c)==(0|s))){t=0,A=n;break b}if(k=i[n+20>>2],n=i[16+((r>>>29&4)+n|0)>>2],A=k?(0|k)==(0|n)?A:k:A,r<<=1,!n)break}else A=0;if(!(A|u)){if(u=0,!(A=(0-(A=2<<o)|A)&b))break c;n=A=(r=(A&0-A)-1|0)>>>12&16,n|=A=(r=r>>>A|0)>>>5&8,n|=A=(r=r>>>A|0)>>>2&4,A=i[4184+(((n|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)<<2)>>2]}if(!A)break s}for(;t=(n=(r=(-8&i[A+4>>2])-c|0)>>>0<t>>>0)?r:t,u=n?A:u,A=(r=i[A+16>>2])||i[A+20>>2];);}if(!(!u|i[972]-c>>>0<=t>>>0)){if(o=i[u+24>>2],(0|u)!=(0|(r=i[u+12>>2]))){A=i[u+8>>2],i[A+12>>2]=r,i[r+8>>2]=A;break r}if(!(A=i[(n=u+20|0)>>2])){if(!(A=i[u+16>>2]))break o;n=u+16|0}for(;k=n,r=A,(A=i[(n=A+20|0)>>2])||(n=r+16|0,A=i[r+16>>2]););i[k>>2]=0;break r}}}if((n=i[972])>>>0>=c>>>0){t=i[975],(r=n-c|0)>>>0>=16?(i[972]=r,A=t+c|0,i[975]=A,i[A+4>>2]=1|r,i[n+t>>2]=r,i[t+4>>2]=3|c):(i[975]=0,i[972]=0,i[t+4>>2]=3|n,i[(A=n+t|0)+4>>2]=1|i[A+4>>2]),A=t+8|0;break A}if((b=i[973])>>>0>c>>>0){r=b-c|0,i[973]=r,A=(n=i[976])+c|0,i[976]=A,i[A+4>>2]=1|r,i[n+4>>2]=3|c,A=n+8|0;break A}if(A=0,s=c+47|0,i[1088]?n=i[1090]:(i[1091]=-1,i[1092]=-1,i[1089]=4096,i[1090]=4096,i[1088]=e+12&-16^1431655768,i[1093]=0,i[1081]=0,n=4096),(n=(k=s+n|0)&(u=0-n|0))>>>0<=c>>>0)break A;if((t=i[1080])&&(o=(r=i[1078])+n|0)>>>0>t>>>0|r>>>0>=o>>>0)break A;if(4&a[4324])break i;c:{s:{if(t=i[976])for(A=4328;;){if((r=i[A>>2])>>>0<=t>>>0&t>>>0<r+i[A+4>>2]>>>0)break s;if(!(A=i[A+8>>2]))break}if(-1==(0|(r=U(0))))break a;if(o=n,(A=(t=i[1089])-1|0)&r&&(o=(n-r|0)+(A+r&0-t)|0),o>>>0<=c>>>0|o>>>0>2147483646)break a;if((t=i[1080])&&t>>>0<(u=(A=i[1078])+o|0)>>>0|A>>>0>=u>>>0)break a;if((0|r)!=(0|(A=U(o))))break c;break t}if((o=u&k-b)>>>0>2147483646)break a;if((0|(r=U(o)))==(i[A>>2]+i[A+4>>2]|0))break f;A=r}if(!(-1==(0|A)|c+48>>>0<=o>>>0)){if((r=(r=i[1090])+(s-o|0)&0-r)>>>0>2147483646){r=A;break t}if(-1!=(0|U(r))){o=r+o|0,r=A;break t}U(0-o|0);break a}if(r=A,-1!=(0|A))break t;break a}u=0;break e}r=0;break r}if(-1!=(0|r))break t}i[1081]=4|i[1081]}if(n>>>0>2147483646)break n;if(-1==(0|(r=U(n)))|-1==(0|(A=U(0)))|A>>>0<=r>>>0)break n;if((o=A-r|0)>>>0<=c+40>>>0)break n}A=i[1078]+o|0,i[1078]=A,A>>>0>f[1079]&&(i[1079]=A);t:{i:{a:{if(s=i[976]){for(A=4328;;){if(((t=i[A>>2])+(n=i[A+4>>2])|0)==(0|r))break a;if(!(A=i[A+8>>2]))break}break i}for((A=i[974])>>>0<=r>>>0&&A||(i[974]=r),A=0,i[1083]=o,i[1082]=r,i[978]=-1,i[979]=i[1088],i[1085]=0;n=(t=A<<3)+3920|0,i[t+3928>>2]=n,i[t+3932>>2]=n,32!=(0|(A=A+1|0)););n=(t=o-40|0)-(A=r+8&7?-8-r&7:0)|0,i[973]=n,A=A+r|0,i[976]=A,i[A+4>>2]=1|n,i[4+(r+t|0)>>2]=40,i[977]=i[1092];break t}if(!(8&a[A+12|0]|t>>>0>s>>>0|r>>>0<=s>>>0)){i[A+4>>2]=n+o,n=(A=s+8&7?-8-s&7:0)+s|0,i[976]=n,A=(r=i[973]+o|0)-A|0,i[973]=A,i[n+4>>2]=1|A,i[4+(r+s|0)>>2]=40,i[977]=i[1092];break t}}f[974]>r>>>0&&(i[974]=r),n=r+o|0,A=4328;i:{a:{f:{o:{u:{c:{for(;;){if((0|n)!=i[A>>2]){if(A=i[A+8>>2])continue;break c}break}if(!(8&a[A+12|0]))break u}for(A=4328;;){if((n=i[A>>2])>>>0<=s>>>0&&(u=n+i[A+4>>2]|0)>>>0>s>>>0)break o;A=i[A+8>>2]}}if(i[A>>2]=r,i[A+4>>2]=i[A+4>>2]+o,i[(k=(r+8&7?-8-r&7:0)+r|0)+4>>2]=3|c,c=(o=n+(n+8&7?-8-n&7:0)|0)-(b=c+k|0)|0,(0|o)==(0|s)){i[976]=b,A=i[973]+c|0,i[973]=A,i[b+4>>2]=1|A;break a}if(i[975]==(0|o)){i[975]=b,A=i[972]+c|0,i[972]=A,i[b+4>>2]=1|A,i[A+b>>2]=A;break a}if(1==(3&(A=i[o+4>>2]))){u=-8&A;u:if(A>>>0<=255){if(n=i[o+8>>2],A=A>>>3|0,(0|(r=i[o+12>>2]))==(0|n)){i[970]=i[970]&F(A);break u}i[n+12>>2]=r,i[r+8>>2]=n}else{if(s=i[o+24>>2],(0|o)==(0|(r=i[o+12>>2])))if((t=i[(A=o+20|0)>>2])||(t=i[(A=o+16|0)>>2])){for(;n=A,(t=i[(A=(r=t)+20|0)>>2])||(A=r+16|0,t=i[r+16>>2]););i[n>>2]=0}else r=0;else A=i[o+8>>2],i[A+12>>2]=r,i[r+8>>2]=A;if(s){n=i[o+28>>2];c:{if(i[(A=4184+(n<<2)|0)>>2]==(0|o)){if(i[A>>2]=r,r)break c;i[971]=i[971]&F(n);break u}if(i[s+(i[s+16>>2]==(0|o)?16:20)>>2]=r,!r)break u}i[r+24>>2]=s,(A=i[o+16>>2])&&(i[r+16>>2]=A,i[A+24>>2]=r),(A=i[o+20>>2])&&(i[r+20>>2]=A,i[A+24>>2]=r)}}c=u+c|0,o=o+u|0}if(i[o+4>>2]=-2&i[o+4>>2],i[b+4>>2]=1|c,i[c+b>>2]=c,c>>>0<=255){r=3920+((A=c>>>3|0)<<3)|0,(n=i[970])&(A=1<<A)?A=i[r+8>>2]:(i[970]=A|n,A=r),i[r+8>>2]=b,i[A+12>>2]=b,i[b+12>>2]=r,i[b+8>>2]=A;break a}if(A=31,c>>>0<=16777215&&(A=c>>>8|0,A<<=t=A+1048320>>>16&8,A=28+((A=((A<<=n=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|n|t)|0)<<1|c>>>A+21&1)|0),i[b+28>>2]=A,i[b+16>>2]=0,i[b+20>>2]=0,t=4184+(A<<2)|0,(n=i[971])&(r=1<<A)){for(A=c<<(31==(0|A)?0:25-(A>>>1|0)|0),r=i[t>>2];;){if(n=r,(-8&i[r+4>>2])==(0|c))break f;if(r=A>>>29|0,A<<=1,!(r=i[(t=n+(4&r)|0)+16>>2]))break}i[t+16>>2]=b,i[b+24>>2]=n}else i[971]=r|n,i[t>>2]=b,i[b+24>>2]=t;i[b+12>>2]=b,i[b+8>>2]=b;break a}for(n=(t=o-40|0)-(A=r+8&7?-8-r&7:0)|0,i[973]=n,A=A+r|0,i[976]=A,i[A+4>>2]=1|n,i[4+(r+t|0)>>2]=40,i[977]=i[1092],i[(n=(A=(u+(u-39&7?39-u&7:0)|0)-47|0)>>>0<s+16>>>0?s:A)+4>>2]=27,A=i[1085],i[n+16>>2]=i[1084],i[n+20>>2]=A,A=i[1083],i[n+8>>2]=i[1082],i[n+12>>2]=A,i[1084]=n+8,i[1083]=o,i[1082]=r,i[1085]=0,A=n+24|0;i[A+4>>2]=7,r=A+8|0,A=A+4|0,r>>>0<u>>>0;);if((0|n)==(0|s))break t;if(i[n+4>>2]=-2&i[n+4>>2],u=n-s|0,i[s+4>>2]=1|u,i[n>>2]=u,u>>>0<=255){r=3920+((A=u>>>3|0)<<3)|0,(n=i[970])&(A=1<<A)?A=i[r+8>>2]:(i[970]=A|n,A=r),i[r+8>>2]=s,i[A+12>>2]=s,i[s+12>>2]=r,i[s+8>>2]=A;break t}if(A=31,i[s+16>>2]=0,i[s+20>>2]=0,u>>>0<=16777215&&(A=u>>>8|0,A<<=t=A+1048320>>>16&8,A=28+((A=((A<<=n=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|n|t)|0)<<1|u>>>A+21&1)|0),i[s+28>>2]=A,t=4184+(A<<2)|0,(n=i[971])&(r=1<<A)){for(A=u<<(31==(0|A)?0:25-(A>>>1|0)|0),r=i[t>>2];;){if(n=r,(0|u)==(-8&i[r+4>>2]))break i;if(r=A>>>29|0,A<<=1,!(r=i[(t=n+(4&r)|0)+16>>2]))break}i[t+16>>2]=s,i[s+24>>2]=n}else i[971]=r|n,i[t>>2]=s,i[s+24>>2]=t;i[s+12>>2]=s,i[s+8>>2]=s;break t}A=i[n+8>>2],i[A+12>>2]=b,i[n+8>>2]=b,i[b+24>>2]=0,i[b+12>>2]=n,i[b+8>>2]=A}A=k+8|0;break A}A=i[n+8>>2],i[A+12>>2]=s,i[n+8>>2]=s,i[s+24>>2]=0,i[s+12>>2]=n,i[s+8>>2]=A}if(!((A=i[973])>>>0<=c>>>0)){r=A-c|0,i[973]=r,A=(n=i[976])+c|0,i[976]=A,i[A+4>>2]=1|r,i[n+4>>2]=3|c,A=n+8|0;break A}}i[969]=48,A=0;break A}r:if(o){n=i[u+28>>2];n:{if(i[(A=4184+(n<<2)|0)>>2]==(0|u)){if(i[A>>2]=r,r)break n;b=F(n)&b,i[971]=b;break r}if(i[o+(i[o+16>>2]==(0|u)?16:20)>>2]=r,!r)break r}i[r+24>>2]=o,(A=i[u+16>>2])&&(i[r+16>>2]=A,i[A+24>>2]=r),(A=i[u+20>>2])&&(i[r+20>>2]=A,i[A+24>>2]=r)}r:if(t>>>0<=15)A=t+c|0,i[u+4>>2]=3|A,i[(A=A+u|0)+4>>2]=1|i[A+4>>2];else if(i[u+4>>2]=3|c,i[(o=u+c|0)+4>>2]=1|t,i[o+t>>2]=t,t>>>0<=255)r=3920+((A=t>>>3|0)<<3)|0,(n=i[970])&(A=1<<A)?A=i[r+8>>2]:(i[970]=A|n,A=r),i[r+8>>2]=o,i[A+12>>2]=o,i[o+12>>2]=r,i[o+8>>2]=A;else{A=31,t>>>0<=16777215&&(A=t>>>8|0,A<<=k=A+1048320>>>16&8,A=28+((A=((A<<=n=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|n|k)|0)<<1|t>>>A+21&1)|0),i[o+28>>2]=A,i[o+16>>2]=0,i[o+20>>2]=0,r=4184+(A<<2)|0;n:{if((n=1<<A)&b){for(A=t<<(31==(0|A)?0:25-(A>>>1|0)|0),n=i[r>>2];;){if((-8&i[(r=n)+4>>2])==(0|t))break n;if(n=A>>>29|0,A<<=1,!(n=i[(k=(4&n)+r|0)+16>>2]))break}i[k+16>>2]=o}else i[971]=n|b,i[r>>2]=o;i[o+24>>2]=r,i[o+12>>2]=o,i[o+8>>2]=o;break r}A=i[r+8>>2],i[A+12>>2]=o,i[r+8>>2]=o,i[o+24>>2]=0,i[o+12>>2]=r,i[o+8>>2]=A}A=u+8|0;break A}e:if(b){n=i[r+28>>2];r:{if(i[(A=4184+(n<<2)|0)>>2]==(0|r)){if(i[A>>2]=u,u)break r;i[971]=F(n)&s;break e}if(i[b+(i[b+16>>2]==(0|r)?16:20)>>2]=u,!u)break e}i[u+24>>2]=b,(A=i[r+16>>2])&&(i[u+16>>2]=A,i[A+24>>2]=u),(A=i[r+20>>2])&&(i[u+20>>2]=A,i[A+24>>2]=u)}t>>>0<=15?(A=t+c|0,i[r+4>>2]=3|A,i[(A=A+r|0)+4>>2]=1|i[A+4>>2]):(i[r+4>>2]=3|c,i[(u=r+c|0)+4>>2]=1|t,i[t+u>>2]=t,l&&(n=3920+((A=l>>>3|0)<<3)|0,k=i[975],(A=1<<A)&o?A=i[n+8>>2]:(i[970]=A|o,A=n),i[n+8>>2]=k,i[A+12>>2]=k,i[k+12>>2]=n,i[k+8>>2]=A),i[975]=u,i[972]=t),A=r+8|0}return p=e+16|0,0|A}function B(A,e){var r,n,t=0,a=0,f=0,g=0,d=0,h=0,m=0,B=0,C=0,v=0,D=0,Q=0,y=0,M=0,E=0,U=0,Y=0,F=0,J=0,P=0,K=0,O=0,N=0;p=r=p-48|0,s(+A),n=0|o(1),t=0|o(0);A:{e:{r:{if((d=2147483647&(a=n))>>>0<=1074752122){if(598523==(1048575&a))break r;if(d>>>0<=1073928572){if((0|n)>0|(0|n)>=0){f=(A+=-1.5707963267341256)+-6077100506506192e-26,b[e>>3]=f,b[e+8>>3]=A-f-6077100506506192e-26,a=1;break A}f=(A+=1.5707963267341256)+6077100506506192e-26,b[e>>3]=f,b[e+8>>3]=A-f+6077100506506192e-26,a=-1;break A}if((0|n)>0|(0|n)>=0){f=(A+=-3.1415926534682512)+-1.2154201013012384e-10,b[e>>3]=f,b[e+8>>3]=A-f-1.2154201013012384e-10,a=2;break A}f=(A+=3.1415926534682512)+1.2154201013012384e-10,b[e>>3]=f,b[e+8>>3]=A-f+1.2154201013012384e-10,a=-2;break A}if(d>>>0<=1075594811){if(d>>>0<=1075183036){if(1074977148==(0|d))break r;if((0|n)>0|(0|n)>=0){f=(A+=-4.712388980202377)+-1.8231301519518578e-10,b[e>>3]=f,b[e+8>>3]=A-f-1.8231301519518578e-10,a=3;break A}f=(A+=4.712388980202377)+1.8231301519518578e-10,b[e>>3]=f,b[e+8>>3]=A-f+1.8231301519518578e-10,a=-3;break A}if(1075388923==(0|d))break r;if((0|n)>0|(0|n)>=0){f=(A+=-6.2831853069365025)+-2.430840202602477e-10,b[e>>3]=f,b[e+8>>3]=A-f-2.430840202602477e-10,a=4;break A}f=(A+=6.2831853069365025)+2.430840202602477e-10,b[e>>3]=f,b[e+8>>3]=A-f+2.430840202602477e-10,a=-4;break A}if(d>>>0>1094263290)break e}t=(F=(f=A+-1.5707963267341256*(B=.6366197723675814*A+6755399441055744-6755399441055744))-(v=6077100506506192e-26*B))<-.7853981633974483,a=l(B)<2147483648?~~B:-2147483648,t?(a=a-1|0,v=6077100506506192e-26*(B+=-1),f=A+-1.5707963267341256*B):F>.7853981633974483&&(a=a+1|0,v=6077100506506192e-26*(B+=1),f=A+-1.5707963267341256*B),A=f-v,b[e>>3]=A,s(+A),g=0|o(1),o(0),((t=d>>>20|0)-(g>>>20&2047)|0)<17||(v=f,A=(f-=A=6077100506303966e-26*B)-(v=20222662487959506e-37*B-(v-f-A)),b[e>>3]=A,g=t,s(+A),t=0|o(1),o(0),(g-(t>>>20&2047)|0)<50||(v=f,A=(f-=A=20222662487111665e-37*B)-(v=84784276603689e-45*B-(v-f-A)),b[e>>3]=A)),b[e+8>>3]=f-A-v;break A}if(d>>>0>=2146435072)A-=A,b[e>>3]=A,b[e+8>>3]=A,a=0;else{for(u(0,0|t),u(1,1048575&n|1096810496),A=+c(),a=0,t=1;C=(r+16|0)+(a<<3)|0,f=+(0|(a=l(A)<2147483648?~~A:-2147483648)),b[C>>3]=f,A=16777216*(A-f),a=1,C=1&t,t=0,C;);if(b[r+32>>3]=A,0==A)for(t=1;a=t,t=t-1|0,0==b[(r+16|0)+(a<<3)>>3];);else a=2;if(J=r+16|0,p=h=p-560|0,d=k(Y=(0|(d=((t=(d>>>20|0)-1046|0)-3|0)/24|0))>0?d:0,-24)+t|0,((Q=i[257])+(m=(M=a+1|0)-1|0)|0)>=0)for(a=Q+M|0,t=Y-m|0;b[(h+320|0)+(g<<3)>>3]=(0|t)<0?0:+i[1040+(t<<2)>>2],t=t+1|0,(0|a)!=(0|(g=g+1|0)););for(C=d-24|0,a=0,g=(0|Q)>0?Q:0,D=(0|M)<=0;;){if(D)A=0;else for(E=a+m|0,t=0,A=0;A=b[(t<<3)+J>>3]*b[(h+320|0)+(E-t<<3)>>3]+A,(0|M)!=(0|(t=t+1|0)););if(b[(a<<3)+h>>3]=A,t=(0|a)==(0|g),a=a+1|0,t)break}O=47-d|0,E=48-d|0,N=d-25|0,a=Q;e:{for(;;){if(A=b[(a<<3)+h>>3],t=0,g=a,!(y=(0|a)<=0))for(;D=(h+480|0)+(t<<2)|0,m=l(f=5.960464477539063e-8*A)<2147483648?~~f:-2147483648,m=l(A=-16777216*(f=+(0|m))+A)<2147483648?~~A:-2147483648,i[D>>2]=m,A=b[((g=g-1|0)<<3)+h>>3]+f,(0|a)!=(0|(t=t+1|0)););A=I(A,C),A+=-8*w(.125*A),A-=+(0|(D=l(A)<2147483648?~~A:-2147483648));r:{n:{t:{if(P=(0|C)<=0){if(C)break t;m=i[476+((a<<2)+h|0)>>2]>>23}else U=g=(a<<2)+h|0,g=(m=i[g+476>>2])-((t=m>>E)<<E)|0,i[U+476>>2]=g,D=t+D|0,m=g>>O;if((0|m)<=0)break r;break n}if(m=2,!(A>=.5)){m=0;break r}}if(t=0,g=0,!y)for(;y=i[(U=(h+480|0)+(t<<2)|0)>>2],K=16777215,g||(K=16777216,y)?(i[U>>2]=K-y,g=1):g=0,(0|a)!=(0|(t=t+1|0)););n:if(!P){t=8388607;t:switch(0|N){case 1:t=4194303;break;case 0:break t;default:break n}i[(y=(a<<2)+h|0)+476>>2]=i[y+476>>2]&t}D=D+1|0,2==(0|m)&&(A=1-A,m=2,g&&(A-=I(1,C)))}if(0!=A)break;if(g=0,!((0|Q)>=(0|(t=a)))){for(;g=i[(h+480|0)+((t=t-1|0)<<2)>>2]|g,(0|t)>(0|Q););if(g){for(d=C;d=d-24|0,!i[(h+480|0)+((a=a-1|0)<<2)>>2];);break e}}for(t=1;g=t,t=t+1|0,!i[(h+480|0)+(Q-g<<2)>>2];);for(g=a+g|0;;){if(m=a+M|0,a=a+1|0,b[(h+320|0)+(m<<3)>>3]=i[1040+(Y+a<<2)>>2],t=0,A=0,(0|M)>0)for(;A=b[(t<<3)+J>>3]*b[(h+320|0)+(m-t<<3)>>3]+A,(0|M)!=(0|(t=t+1|0)););if(b[(a<<3)+h>>3]=A,!((0|a)<(0|g)))break}a=g}(A=I(A,24-d|0))>=16777216?(C=(h+480|0)+(a<<2)|0,t=l(f=5.960464477539063e-8*A)<2147483648?~~f:-2147483648,g=l(A=-16777216*+(0|t)+A)<2147483648?~~A:-2147483648,i[C>>2]=g,a=a+1|0):(t=l(A)<2147483648?~~A:-2147483648,d=C),i[(h+480|0)+(a<<2)>>2]=t}if(A=I(1,d),!((0|a)<0)){for(t=a;g=t,b[(t<<3)+h>>3]=A*+i[(h+480|0)+(t<<2)>>2],t=t-1|0,A*=5.960464477539063e-8,g;);if(!((0|a)<0))for(t=a;;){for(g=t,d=a-t|0,A=0,t=0;A=b[3808+(t<<3)>>3]*b[(t+g<<3)+h>>3]+A,!((0|t)>=(0|Q))&&(C=t>>>0<d>>>0,t=t+1|0,C););if(b[(h+160|0)+(d<<3)>>3]=A,t=g-1|0,!((0|g)>0))break}}if(A=0,(0|a)>=0)for(t=a;g=t,t=t-1|0,A+=b[(h+160|0)+(g<<3)>>3],g;);if(b[r>>3]=m?-A:A,A=b[h+160>>3]-A,t=1,(0|a)>0)for(;A+=b[(h+160|0)+(t<<3)>>3],g=(0|t)!=(0|a),t=t+1|0,g;);b[r+8>>3]=m?-A:A,p=h+560|0,a=7&D,A=b[r>>3],(0|n)<0?(b[e>>3]=-A,b[e+8>>3]=-b[r+8>>3],a=0-a|0):(b[e>>3]=A,b[e+8>>3]=b[r+8>>3])}}return p=r+48|0,a}function C(A){var e=0,r=0,n=0,t=0,a=0,o=0,u=0;A:if(A|=0){a=(n=A-8|0)+(A=-8&(e=i[A-4>>2]))|0;e:if(!(1&e)){if(!(3&e))break A;if((n=n-(e=i[n>>2])|0)>>>0<f[974])break A;if(A=A+e|0,i[975]==(0|n)){if(3==(3&(e=i[a+4>>2])))return i[972]=A,i[a+4>>2]=-2&e,i[n+4>>2]=1|A,void(i[A+n>>2]=A)}else{if(e>>>0<=255){if(t=i[n+8>>2],e=e>>>3|0,(0|(r=i[n+12>>2]))==(0|t)){i[970]=i[970]&F(e);break e}i[t+12>>2]=r,i[r+8>>2]=t;break e}if(u=i[n+24>>2],(0|n)==(0|(e=i[n+12>>2])))if((r=i[(t=n+20|0)>>2])||(r=i[(t=n+16|0)>>2])){for(;o=t,(r=i[(t=(e=r)+20|0)>>2])||(t=e+16|0,r=i[e+16>>2]););i[o>>2]=0}else e=0;else r=i[n+8>>2],i[r+12>>2]=e,i[e+8>>2]=r;if(!u)break e;t=i[n+28>>2];r:{if(i[(r=4184+(t<<2)|0)>>2]==(0|n)){if(i[r>>2]=e,e)break r;i[971]=i[971]&F(t);break e}if(i[u+(i[u+16>>2]==(0|n)?16:20)>>2]=e,!e)break e}if(i[e+24>>2]=u,(r=i[n+16>>2])&&(i[e+16>>2]=r,i[r+24>>2]=e),!(r=i[n+20>>2]))break e;i[e+20>>2]=r,i[r+24>>2]=e}}if(!(n>>>0>=a>>>0)&&1&(e=i[a+4>>2])){e:{if(!(2&e)){if(i[976]==(0|a)){if(i[976]=n,A=i[973]+A|0,i[973]=A,i[n+4>>2]=1|A,i[975]!=(0|n))break A;return i[972]=0,void(i[975]=0)}if(i[975]==(0|a))return i[975]=n,A=i[972]+A|0,i[972]=A,i[n+4>>2]=1|A,void(i[A+n>>2]=A);A=(-8&e)+A|0;r:if(e>>>0<=255){if(t=i[a+8>>2],e=e>>>3|0,(0|(r=i[a+12>>2]))==(0|t)){i[970]=i[970]&F(e);break r}i[t+12>>2]=r,i[r+8>>2]=t}else{if(u=i[a+24>>2],(0|a)==(0|(e=i[a+12>>2])))if((r=i[(t=a+20|0)>>2])||(r=i[(t=a+16|0)>>2])){for(;o=t,(r=i[(t=(e=r)+20|0)>>2])||(t=e+16|0,r=i[e+16>>2]););i[o>>2]=0}else e=0;else r=i[a+8>>2],i[r+12>>2]=e,i[e+8>>2]=r;if(u){t=i[a+28>>2];n:{if(i[(r=4184+(t<<2)|0)>>2]==(0|a)){if(i[r>>2]=e,e)break n;i[971]=i[971]&F(t);break r}if(i[u+(i[u+16>>2]==(0|a)?16:20)>>2]=e,!e)break r}i[e+24>>2]=u,(r=i[a+16>>2])&&(i[e+16>>2]=r,i[r+24>>2]=e),(r=i[a+20>>2])&&(i[e+20>>2]=r,i[r+24>>2]=e)}}if(i[n+4>>2]=1|A,i[A+n>>2]=A,i[975]!=(0|n))break e;return void(i[972]=A)}i[a+4>>2]=-2&e,i[n+4>>2]=1|A,i[A+n>>2]=A}if(A>>>0<=255)return e=3920+((A=A>>>3|0)<<3)|0,(r=i[970])&(A=1<<A)?A=i[e+8>>2]:(i[970]=A|r,A=e),i[e+8>>2]=n,i[A+12>>2]=n,i[n+12>>2]=e,void(i[n+8>>2]=A);t=31,i[n+16>>2]=0,i[n+20>>2]=0,A>>>0<=16777215&&(e=A>>>8|0,e<<=o=e+1048320>>>16&8,t=28+((e=((e<<=t=e+520192>>>16&4)<<(r=e+245760>>>16&2)>>>15|0)-(r|t|o)|0)<<1|A>>>e+21&1)|0),i[n+28>>2]=t,o=4184+(t<<2)|0;e:{r:{if((r=i[971])&(e=1<<t)){for(t=A<<(31==(0|t)?0:25-(t>>>1|0)|0),e=i[o>>2];;){if(r=e,(-8&i[e+4>>2])==(0|A))break r;if(e=t>>>29|0,t<<=1,!(e=i[(o=r+(4&e)|0)+16>>2]))break}i[o+16>>2]=n,i[n+24>>2]=r}else i[971]=e|r,i[o>>2]=n,i[n+24>>2]=o;i[n+12>>2]=n,i[n+8>>2]=n;break e}A=i[r+8>>2],i[A+12>>2]=n,i[r+8>>2]=n,i[n+24>>2]=0,i[n+12>>2]=r,i[n+8>>2]=A}A=i[978]-1|0,i[978]=A||-1}}}function v(A,e,r,n,t){var a,f,o=0,u=0,c=0,s=0,l=0,w=0,g=0,d=0,h=0,m=0,B=0,C=0,D=0,Q=0,I=0,M=0,E=0,U=0;if(a=c=p,1==(0|e))return A=i[r+4>>2],i[n>>2]=i[r>>2],i[n+4>>2]=A,A=i[r+12>>2],i[n+8>>2]=i[r+8>>2],i[n+12>>2]=A,void(p=a);f=(0-k(i[A>>2],t)>>>0)/(e>>>0)|0,p=o=w=(o=c)-(u=(c=(0|e)/2|0)<<4)|0;A:{if((m=e+1|0)>>>0<=2)p=e=o=o-u|0,p=e=e-u|0;else{for(B=y(w,u),p=o=o-u|0,u=y(o,u),U=c>>>0>1?c:1;h=i[(e=(s<<5)+r|0)+4>>2],i[(l=(g=s<<4)+B|0)>>2]=i[e>>2],i[l+4>>2]=h,h=i[e+12>>2],i[l+8>>2]=i[e+8>>2],i[l+12>>2]=h,l=u+g|0,g=i[e+28>>2],i[l+8>>2]=i[e+24>>2],i[l+12>>2]=g,g=i[e+20>>2],i[l>>2]=i[e+16>>2],i[l+4>>2]=g,(0|U)!=(0|(s=s+1|0)););if(p=e=o-(r=c<<4)|0,!(m>>>0<3)){for(s=0,o=y(e,r),p=e=e-r|0,e=y(e,r),v(A,c,B,o,t),v(A,c,u,e,t),t=c>>>0>1?c:1;C=b[(u=(r=s<<4)+o|0)>>3],w=r+n|0,D=b[u+8>>3],d=b[(r=e+r|0)>>3],u=i[A+4>>2]+((i[A>>2]-1&k(s,f))<<4)|0,E=d*(Q=b[u+8>>3])+(I=b[r+8>>3])*(M=b[u>>3]),b[w+8>>3]=D+E,d=d*M-Q*I,b[w>>3]=C+d,b[(r=(c+s<<4)+n|0)+8>>3]=D-E,b[r>>3]=C-d,(0|t)!=(0|(s=s+1|0)););break A}}p=r=e-(c<<4)|0,v(A,0,w,e,t),v(A,0,o,r,t)}p=a}function D(A){var e,r=0,n=0;p=e=p-16|0,s(+A),n=0|o(1),o(0);A:if((n&=2147483647)>>>0<=1072243195){if(r=1,n>>>0<1044816030)break A;r=E(A,0)}else if(r=A-A,!(n>>>0>=2146435072)){e:switch(3&B(A,e)){case 0:r=E(b[e>>3],b[e+8>>3]);break A;case 1:r=-M(b[e>>3],b[e+8>>3],1);break A;case 2:r=-E(b[e>>3],b[e+8>>3]);break A;default:break e}r=M(b[e>>3],b[e+8>>3],1)}return p=e+16|0,A=r}function Q(A){var e,r=0;p=e=p-16|0,s(+A),r=0|o(1),o(0);A:if((r&=2147483647)>>>0<=1072243195){if(r>>>0<1045430272)break A;A=M(A,0,0)}else if(r>>>0>=2146435072)A-=A;else{e:switch(3&B(A,e)){case 0:A=M(b[e>>3],b[e+8>>3],1);break A;case 1:A=E(b[e>>3],b[e+8>>3]);break A;case 2:A=-M(b[e>>3],b[e+8>>3],1);break A;default:break e}A=-E(b[e>>3],b[e+8>>3])}return p=e+16|0,A}function y(A,e){var r=0,t=0,i=0,a=0;if(e){if(t=7&e,e-1>>>0>=7)for(a=-8&e,e=0;n[A+r|0]=0,n[(1|r)+A|0]=0,n[(2|r)+A|0]=0,n[(3|r)+A|0]=0,n[(4|r)+A|0]=0,n[(5|r)+A|0]=0,n[(6|r)+A|0]=0,n[(7|r)+A|0]=0,r=r+8|0,(0|a)!=(0|(e=e+8|0)););if(t)for(;n[A+r|0]=0,r=r+1|0,(0|(i=i+1|0))!=(0|t););}return A}function I(A,e){A:if((0|e)>=1024){if(A*=898846567431158e293,e>>>0<2047){e=e-1023|0;break A}A*=898846567431158e293,e=((0|e)<3069?e:3069)-2046|0}else(0|e)>-1023||(A*=2004168360008973e-307,e>>>0>4294965304?e=e+969|0:(A*=2004168360008973e-307,e=((0|e)>-2960?e:-2960)+1938|0));return u(0,0),u(1,e+1023<<20),A*+c()}function M(A,e,r){var n,t,i;return i=(n=A*A)*(n*n)*(1.58969099521155e-10*n-2.5050760253406863e-8)+(n*(27557313707070068e-22*n-.0001984126982985795)+.00833333333332249),t=n*A,r?A-(n*(.5*e-i*t)-e+.16666666666666632*t):t*(n*i-.16666666666666632)+A}function E(A,e){var r,n,t=0;return(n=1-(t=.5*(r=A*A)))+(1-n-t+(r*(r*(r*(2480158728947673e-20*r-.001388888888887411)+.0416666666666666)+(t=r*r)*t*(r*(-11359647557788195e-27*r+2.087572321298175e-9)-2.7557314351390663e-7))-A*e))}function U(A){var e,n;return(A=(e=i[968])+(n=A+3&-4)|0)>>>0<=e>>>0&&n||A>>>0>(r.byteLength/65536|0)<<16>>>0&&!(0|d(0|A))?(i[969]=48,-1):(i[968]=A,e)}function Y(A){var e=0;A=A||1;A:{for(;;){if(e=m(A))break A;if(!(e=i[1094]))break;P[0|e]()}h(),g()}return e}function F(A){var e;return(-1>>>(e=31&A)&-2)<<e|(-1<<(A=0-A&31)&-2)>>>A}t(e=a,1024,"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"),t(e,3811,"QPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNQ=="),t(e,3872,"IBFQ");var J,P=((J=[]).set=function(A,e){this[A]=e},J.get=function(A){return this[A]},J);return{d:function(){},e:function(A){A|=0;var e,r,n=0,t=0,a=0,f=0,o=0,u=0,c=0,s=0;if(e=Y(8),n=A<<4,r=Y((268435455&A)!=(0|A)?-1:n),A){if(n=y(r,n),t=+(A>>>0),1!=(0|A))for(s=-2&A;o=6.283185307179586*+(a>>>0)/t,b[(f=n+(a<<4)|0)+8>>3]=Q(o),b[f>>3]=D(o),o=6.283185307179586*+((f=1|a)>>>0)/t,b[(u=n+(f<<4)|0)+8>>3]=Q(o),b[u>>3]=D(o),a=a+2|0,(0|(c=c+2|0))!=(0|s););1&A&&(t=6.283185307179586*+(a>>>0)/t,b[(n=n+(a<<4)|0)+8>>3]=Q(t),b[n>>3]=D(t))}return i[e+4>>2]=r,i[e>>2]=A,0|e},f:function(A,e,r,n){e|=0,r|=0,n|=0,v(A|=0,i[A>>2],e,r,n)},g:function(A){var e=0;(A|=0)&&((e=i[A+4>>2])&&C(e),C(A))},h:P,i:m,j:C}}(A)}(L)},instantiate:function(A,e){return{then:function(e){var r=new s.Module(A);e({instance:new s.Instance(r)})}}},RuntimeError:Error};o=[],"object"!=typeof s&&E("no native wasm support detected");var b,k,l,w,g,d,h,p=!1;var m,B,C=e.INITIAL_MEMORY||16777216;(c=e.wasmMemory?e.wasmMemory:new s.Memory({initial:C/65536,maximum:C/65536}))&&(b=c.buffer),C=b.byteLength,b=m=b,e.HEAP8=k=new Int8Array(m),e.HEAP16=w=new Int16Array(m),e.HEAP32=g=new Int32Array(m),e.HEAPU8=l=new Uint8Array(m),e.HEAPU16=new Uint16Array(m),e.HEAPU32=new Uint32Array(m),e.HEAPF32=d=new Float32Array(m),e.HEAPF64=h=new Float64Array(m);var v=[],D=[],Q=[];var y=0,I=null,M=null;function E(A){e.onAbort&&e.onAbort(A),u(A="Aborted("+A+")"),p=!0,1,A+=". Build with -s ASSERTIONS=1 for more info.";var r=new s.RuntimeError(A);throw n(r),r}e.preloadedImages={},e.preloadedAudios={};var U,Y,F,J,P="data:application/octet-stream;base64,";function K(A){return A.startsWith(P)}function O(A){try{if(A==U&&o)return new Uint8Array(o);var e=G(A);if(e)return e;if(t)return t(A);throw"both async and sync fetching of the wasm failed"}catch(u){E(u)}}function N(A){for(;A.length>0;){var r=A.shift();if("function"!=typeof r){var n=r.func;"number"==typeof n?void 0===r.arg?x(n)():x(n)(r.arg):n(void 0===r.arg?null:r.arg)}else r(e)}}K(U="fft02.wasm")||(Y=U,U=e.locateFile?e.locateFile(Y,f):f+Y);var R=[];function x(A){var e=R[A];return e||(A>=R.length&&(R.length=A+1),R[A]=e=B.get(A)),e}var H="function"==typeof atob?atob:function(A){var e,r,n,t,i,a,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",o="",u=0;A=A.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{e=f.indexOf(A.charAt(u++))<<2|(t=f.indexOf(A.charAt(u++)))>>4,r=(15&t)<<4|(i=f.indexOf(A.charAt(u++)))>>2,n=(3&i)<<6|(a=f.indexOf(A.charAt(u++))),o+=String.fromCharCode(e),64!==i&&(o+=String.fromCharCode(r)),64!==a&&(o+=String.fromCharCode(n))}while(u<A.length);return o};function G(A){if(K(A))return function(A){try{for(var e=H(A),r=new Uint8Array(e.length),n=0;n<e.length;++n)r[n]=e.charCodeAt(n);return r}catch(t){throw new Error("Converting base64 string to bytes failed.")}}(A.slice(P.length))}var S,L={c:function(){E("")},b:function(A){l.length,E("OOM")},a:c};(function(){var A={a:L};function r(A,r){var n,t=A.exports;e.asm=t,B=e.asm.h,n=e.asm.d,D.unshift(n),function(A){if(y--,e.monitorRunDependencies&&e.monitorRunDependencies(y),0==y&&(null!==I&&(clearInterval(I),I=null),M)){var r=M;M=null,r()}}()}function t(A){r(A.instance)}function i(e){return(o||"function"!=typeof fetch?Promise.resolve().then((function(){return O(U)})):fetch(U,{credentials:"same-origin"}).then((function(A){if(!A.ok)throw"failed to load wasm binary file at '"+U+"'";return A.arrayBuffer()})).catch((function(){return O(U)}))).then((function(e){return s.instantiate(e,A)})).then((function(A){return A})).then(e,(function(A){u("failed to asynchronously prepare wasm: "+A),E(A)}))}if(y++,e.monitorRunDependencies&&e.monitorRunDependencies(y),e.instantiateWasm)try{return e.instantiateWasm(A,r)}catch(a){return u("Module.instantiateWasm callback failed with error: "+a),!1}(o||"function"!=typeof s.instantiateStreaming||K(U)||"function"!=typeof fetch?i(t):fetch(U,{credentials:"same-origin"}).then((function(e){return s.instantiateStreaming(e,A).then(t,(function(A){return u("wasm streaming compile failed: "+A),u("falling back to ArrayBuffer instantiation"),i(t)}))}))).catch(n)})(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.d).apply(null,arguments)},e._prepare_fft=function(){return(e._prepare_fft=e.asm.e).apply(null,arguments)},e._run_fft=function(){return(e._run_fft=e.asm.f).apply(null,arguments)},e._delete_fft=function(){return(e._delete_fft=e.asm.g).apply(null,arguments)},e._malloc=function(){return(e._malloc=e.asm.i).apply(null,arguments)},e._free=function(){return(e._free=e.asm.j).apply(null,arguments)};function V(A){function n(){S||(S=!0,e.calledRun=!0,p||(!0,N(D),r(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),function(){if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;)A=e.postRun.shift(),Q.unshift(A);var A;N(Q)}()))}A=A||a,y>0||(!function(){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)A=e.preRun.shift(),v.unshift(A);var A;N(v)}(),y>0||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),n()}),1)):n()))}if(e.setValue=function(A,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"i8";switch("*"===r.charAt(r.length-1)&&(r="i32"),r){case"i1":case"i8":k[A>>0]=e;break;case"i16":w[A>>1]=e;break;case"i32":g[A>>2]=e;break;case"i64":J=[e>>>0,(F=e,+Math.abs(F)>=1?F>0?(0|Math.min(+Math.floor(F/4294967296),4294967295))>>>0:~~+Math.ceil((F-+(~~F>>>0))/4294967296)>>>0:0)],g[A>>2]=J[0],g[A+4>>2]=J[1];break;case"float":d[A>>2]=e;break;case"double":h[A>>3]=e;break;default:E("invalid type for setValue: "+r)}},e.getValue=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"i8";switch("*"===e.charAt(e.length-1)&&(e="i32"),e){case"i1":case"i8":return k[A>>0];case"i16":return w[A>>1];case"i32":case"i64":return g[A>>2];case"float":return d[A>>2];case"double":return Number(h[A>>3]);default:E("invalid type for getValue: "+e)}return null},M=function A(){S||V(),S||(M=A)},e.run=V,e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();return V(),e.ready}}();"object"===typeof n&&"object"===typeof t?t.exports=i:"function"===typeof define&&define.amd?define([],(function(){return i})):"object"===typeof n&&(n.Module=i),e.default=t.exports}}]);
//# sourceMappingURL=13.334ed43e.chunk.js.map