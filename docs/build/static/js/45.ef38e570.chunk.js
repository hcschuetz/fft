"use strict";(self.webpackChunkfft_browser_test=self.webpackChunkfft_browser_test||[]).push([[45],{4045:function(A,e,r){r.r(e);var n={},i={exports:n},t=function(){var A="undefined"!==typeof document&&document.currentScript?document.currentScript.src:void 0;return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(e){var r,n;(e="undefined"!=typeof e?e:{}).ready=new Promise((function(A,e){r=A,n=e}));var i,t=Object.assign({},e),f="";"undefined"!=typeof document&&document.currentScript&&(f=document.currentScript.src),A&&(f=A),f=0!==f.indexOf("blob:")?f.substr(0,f.replace(/[?#].*/,"").lastIndexOf("/")+1):"";e.print||console.log.bind(console);var a,o=e.printErr||console.error.bind(console);Object.assign(e,t),t=null,e.arguments&&e.arguments,e.thisProgram&&e.thisProgram,e.quit&&e.quit,e.wasmBinary&&(a=e.wasmBinary);e.noExitRuntime;var u,c={Memory:function(A){this.buffer=new ArrayBuffer(65536*A.initial)},Module:function(A){},Instance:function(A,e){this.exports=function(A){for(var e,r=new Uint8Array(123),n=25;n>=0;--n)r[48+n]=52+n,r[65+n]=n,r[97+n]=26+n;function i(A,e,n){for(var i,t,f=0,a=e,o=n.length,u=e+(3*o>>2)-("="==n[o-2])-("="==n[o-1]);f<o;f+=4)i=r[n.charCodeAt(f+1)],t=r[n.charCodeAt(f+2)],A[a++]=r[n.charCodeAt(f)]<<2|i>>4,a<u&&(A[a++]=i<<4|t>>2),a<u&&(A[a++]=t<<6|r[n.charCodeAt(f+3)])}r[43]=62,r[47]=63;var t=new ArrayBuffer(16),f=new Int32Array(t),a=(new Float32Array(t),new Float64Array(t));function o(A){return f[A]}function u(A,e){f[A]=e}function c(){return a[0]}function b(A){a[0]=A}return function(A){var r=A.a,n=r.a.buffer,t=new Int8Array(n),f=(new Int16Array(n),new Int32Array(n)),a=new Uint8Array(n),k=(new Uint16Array(n),new Uint32Array(n)),s=(new Float32Array(n),new Float64Array(n)),l=Math.imul,w=(Math.fround,Math.abs),g=Math.clz32,h=(Math.min,Math.max,Math.floor),d=(Math.ceil,Math.trunc,Math.sqrt,r.b),p=r.c,C=69920;function B(A){var e,r=0,n=0,i=0,t=0,o=0,u=0,c=0,b=0,s=0,l=0;C=e=C-16|0;A:{e:{r:{n:{i:{t:{f:{a:{o:{u:{c:{b:{k:{s:{if((A|=0)>>>0<=244){if(3&(r=(u=f[970])>>>(n=(c=A>>>0<11?16:A+11&-8)>>>3|0)|0)){r=(A=(n=n+(1&(-1^r))|0)<<3)+3920|0,i=f[A+3928>>2],(0|r)!=(0|(A=f[i+8>>2]))?(f[A+12>>2]=r,f[r+8>>2]=A):f[970]=E(n)&u,A=i+8|0,r=n<<3,f[i+4>>2]=3|r,f[(r=r+i|0)+4>>2]=1|f[r+4>>2];break A}if((l=f[972])>>>0>=c>>>0)break s;if(r){r=(A=(i=U(0-(A=(0-(A=2<<n)|A)&r<<n)&A))<<3)+3920|0,t=f[A+3928>>2],(0|r)!=(0|(A=f[t+8>>2]))?(f[A+12>>2]=r,f[r+8>>2]=A):(u=E(i)&u,f[970]=u),f[t+4>>2]=3|c,i=(A=i<<3)-c|0,f[(n=t+c|0)+4>>2]=1|i,f[A+t>>2]=i,l&&(r=3920+(-8&l)|0,o=f[975],(A=1<<(l>>>3))&u?A=f[r+8>>2]:(f[970]=A|u,A=r),f[r+8>>2]=o,f[A+12>>2]=o,f[o+12>>2]=r,f[o+8>>2]=A),A=t+8|0,f[975]=n,f[972]=i;break A}if(!(s=f[971]))break s;for(n=f[4184+(U(0-s&s)<<2)>>2],o=(-8&f[n+4>>2])-c|0,r=n;(A=f[r+16>>2])||(A=f[r+20>>2]);)o=(i=(r=(-8&f[A+4>>2])-c|0)>>>0<o>>>0)?r:o,n=i?A:n,r=A;if(b=f[n+24>>2],(0|(i=f[n+12>>2]))!=(0|n)){A=f[n+8>>2],f[A+12>>2]=i,f[i+8>>2]=A;break e}if(!(A=f[(r=n+20|0)>>2])){if(!(A=f[n+16>>2]))break k;r=n+16|0}for(;t=r,i=A,(A=f[(r=A+20|0)>>2])||(r=i+16|0,A=f[i+16>>2]););f[t>>2]=0;break e}if(c=-1,!(A>>>0>4294967231)&&(c=-8&(A=A+11|0),s=f[971])){o=0-c|0,u=0,c>>>0<256||(u=31,c>>>0>16777215||(u=62+((c>>>38-(A=g(A>>>8|0))&1)-(A<<1)|0)|0));l:{w:{if(r=f[4184+(u<<2)>>2])for(A=0,n=c<<(31!=(0|u)?25-(u>>>1|0)|0:0);;){if(!((t=(-8&f[r+4>>2])-c|0)>>>0>=o>>>0)&&(i=r,o=t,!t)){o=0,A=r;break w}if(t=f[r+20>>2],r=f[16+((n>>>29&4)+r|0)>>2],A=t?(0|t)==(0|r)?A:t:A,n<<=1,!r)break}else A=0;if(!(A|i)){if(i=0,!(A=(0-(A=2<<u)|A)&s))break s;A=f[4184+(U(A&0-A)<<2)>>2]}if(!A)break l}for(;o=(n=(r=(-8&f[A+4>>2])-c|0)>>>0<o>>>0)?r:o,i=n?A:i,A=(r=f[A+16>>2])||f[A+20>>2];);}if(!(!i|f[972]-c>>>0<=o>>>0)){if(u=f[i+24>>2],(0|i)!=(0|(n=f[i+12>>2]))){A=f[i+8>>2],f[A+12>>2]=n,f[n+8>>2]=A;break r}if(!(A=f[(r=i+20|0)>>2])){if(!(A=f[i+16>>2]))break b;r=i+16|0}for(;t=r,n=A,(A=f[(r=A+20|0)>>2])||(r=n+16|0,A=f[n+16>>2]););f[t>>2]=0;break r}}}if((A=f[972])>>>0>=c>>>0){i=f[975],(r=A-c|0)>>>0>=16?(f[(n=i+c|0)+4>>2]=1|r,f[A+i>>2]=r,f[i+4>>2]=3|c):(f[i+4>>2]=3|A,f[(A=A+i|0)+4>>2]=1|f[A+4>>2],n=0,r=0),f[972]=r,f[975]=n,A=i+8|0;break A}if((b=f[973])>>>0>c>>>0){r=b-c|0,f[973]=r,A=(n=f[976])+c|0,f[976]=A,f[A+4>>2]=1|r,f[n+4>>2]=3|c,A=n+8|0;break A}if(A=0,s=c+47|0,f[1088]?n=f[1090]:(f[1091]=-1,f[1092]=-1,f[1089]=4096,f[1090]=4096,f[1088]=e+12&-16^1431655768,f[1093]=0,f[1081]=0,n=4096),(r=(t=s+n|0)&(o=0-n|0))>>>0<=c>>>0)break A;if((i=f[1080])&&i>>>0<(u=(n=f[1078])+r|0)>>>0|n>>>0>=u>>>0)break A;s:{if(!(4&a[4324])){l:{w:{g:{h:{if(i=f[976])for(A=4328;;){if((n=f[A>>2])>>>0<=i>>>0&i>>>0<n+f[A+4>>2]>>>0)break h;if(!(A=f[A+8>>2]))break}if(-1==(0|(n=y(0))))break l;if(u=r,(A=(i=f[1089])-1|0)&n&&(u=(r-n|0)+(A+n&0-i)|0),u>>>0<=c>>>0)break l;if((i=f[1080])&&i>>>0<(o=(A=f[1078])+u|0)>>>0|A>>>0>=o>>>0)break l;if((0|n)!=(0|(A=y(u))))break g;break s}if((0|(n=y(u=o&t-b)))==(f[A>>2]+f[A+4>>2]|0))break w;A=n}if(-1==(0|A))break l;if(c+48>>>0<=u>>>0){n=A;break s}if(-1==(0|y(n=(n=f[1090])+(s-u|0)&0-n)))break l;u=n+u|0,n=A;break s}if(-1!=(0|n))break s}f[1081]=4|f[1081]}if(-1==(0|(n=y(r)))|-1==(0|(A=y(0)))|A>>>0<=n>>>0)break o;if((u=A-n|0)>>>0<=c+40>>>0)break o}A=f[1078]+u|0,f[1078]=A,A>>>0>k[1079]&&(f[1079]=A);s:{if(t=f[976]){for(A=4328;;){if(((i=f[A>>2])+(r=f[A+4>>2])|0)==(0|n))break s;if(!(A=f[A+8>>2]))break}break c}for((A=f[974])>>>0<=n>>>0&&A||(f[974]=n),A=0,f[1083]=u,f[1082]=n,f[978]=-1,f[979]=f[1088],f[1085]=0;r=(i=A<<3)+3920|0,f[i+3928>>2]=r,f[i+3932>>2]=r,32!=(0|(A=A+1|0)););r=(i=u-40|0)-(A=n+8&7?-8-n&7:0)|0,f[973]=r,A=A+n|0,f[976]=A,f[A+4>>2]=1|r,f[4+(n+i|0)>>2]=40,f[977]=f[1092];break u}if(8&f[A+12>>2]|n>>>0<=t>>>0|i>>>0>t>>>0)break c;f[A+4>>2]=r+u,n=(A=t+8&7?-8-t&7:0)+t|0,f[976]=n,A=(r=f[973]+u|0)-A|0,f[973]=A,f[n+4>>2]=1|A,f[4+(r+t|0)>>2]=40,f[977]=f[1092];break u}i=0;break e}n=0;break r}k[974]>n>>>0&&(f[974]=n),r=n+u|0,A=4328;c:{b:{k:{for(;;){if((0|r)!=f[A>>2]){if(A=f[A+8>>2])continue;break k}break}if(!(8&a[A+12|0]))break b}for(A=4328;;){if((r=f[A>>2])>>>0<=t>>>0&&(o=r+f[A+4>>2]|0)>>>0>t>>>0)break c;A=f[A+8>>2]}}if(f[A>>2]=n,f[A+4>>2]=f[A+4>>2]+u,f[(s=(n+8&7?-8-n&7:0)+n|0)+4>>2]=3|c,A=(u=r+(r+8&7?-8-r&7:0)|0)-(b=c+s|0)|0,(0|t)==(0|u)){f[976]=b,A=f[973]+A|0,f[973]=A,f[b+4>>2]=1|A;break n}if(f[975]==(0|u)){f[975]=b,A=f[972]+A|0,f[972]=A,f[b+4>>2]=1|A,f[A+b>>2]=A;break n}if(1!=(3&(o=f[u+4>>2])))break i;if(t=-8&o,o>>>0<=255){if((0|(n=f[u+12>>2]))==(0|(r=f[u+8>>2]))){f[970]=f[970]&E(o>>>3|0);break t}f[r+12>>2]=n,f[n+8>>2]=r;break t}if(c=f[u+24>>2],(0|u)!=(0|(n=f[u+12>>2]))){r=f[u+8>>2],f[r+12>>2]=n,f[n+8>>2]=r;break f}if(!(o=f[(r=u+20|0)>>2])){if(!(o=f[u+16>>2]))break a;r=u+16|0}for(;i=r,(o=f[(r=(n=o)+20|0)>>2])||(r=n+16|0,o=f[n+16>>2]););f[i>>2]=0;break f}for(r=(i=u-40|0)-(A=n+8&7?-8-n&7:0)|0,f[973]=r,A=A+n|0,f[976]=A,f[A+4>>2]=1|r,f[4+(n+i|0)>>2]=40,f[977]=f[1092],f[(i=(A=(o+(o-39&7?39-o&7:0)|0)-47|0)>>>0<t+16>>>0?t:A)+4>>2]=27,A=f[1085],f[i+16>>2]=f[1084],f[i+20>>2]=A,A=f[1083],f[i+8>>2]=f[1082],f[i+12>>2]=A,f[1084]=i+8,f[1083]=u,f[1082]=n,f[1085]=0,A=i+24|0;f[A+4>>2]=7,r=A+8|0,A=A+4|0,r>>>0<o>>>0;);if((0|i)!=(0|t))if(f[i+4>>2]=-2&f[i+4>>2],o=i-t|0,f[t+4>>2]=1|o,f[i>>2]=o,o>>>0<=255)r=3920+(-8&o)|0,(n=f[970])&(A=1<<(o>>>3))?A=f[r+8>>2]:(f[970]=A|n,A=r),f[r+8>>2]=t,f[A+12>>2]=t,f[t+12>>2]=r,f[t+8>>2]=A;else{A=31,o>>>0<=16777215&&(A=62+((o>>>38-(A=g(o>>>8|0))&1)-(A<<1)|0)|0),f[t+28>>2]=A,f[t+16>>2]=0,f[t+20>>2]=0,r=4184+(A<<2)|0;c:{if((i=f[971])&(n=1<<A)){for(A=o<<(31!=(0|A)?25-(A>>>1|0)|0:0),i=f[r>>2];;){if((0|o)==(-8&f[(r=i)+4>>2]))break c;if(n=A>>>29|0,A<<=1,!(i=f[(n=(4&n)+r|0)+16>>2]))break}f[n+16>>2]=t}else f[971]=n|i,f[r>>2]=t;f[t+24>>2]=r,f[t+12>>2]=t,f[t+8>>2]=t;break u}A=f[r+8>>2],f[A+12>>2]=t,f[r+8>>2]=t,f[t+24>>2]=0,f[t+12>>2]=r,f[t+8>>2]=A}}if(!((A=f[973])>>>0<=c>>>0)){r=A-c|0,f[973]=r,A=(n=f[976])+c|0,f[976]=A,f[A+4>>2]=1|r,f[n+4>>2]=3|c,A=n+8|0;break A}}f[969]=48,A=0;break A}n=0}if(c){i=f[u+28>>2];f:{if(f[(r=4184+(i<<2)|0)>>2]==(0|u)){if(f[r>>2]=n,n)break f;f[971]=f[971]&E(i);break t}if(f[c+(f[c+16>>2]==(0|u)?16:20)>>2]=n,!n)break t}f[n+24>>2]=c,(r=f[u+16>>2])&&(f[n+16>>2]=r,f[r+24>>2]=n),(r=f[u+20>>2])&&(f[n+20>>2]=r,f[r+24>>2]=n)}}A=A+t|0,o=f[(u=t+u|0)+4>>2]}if(f[u+4>>2]=-2&o,f[b+4>>2]=1|A,f[A+b>>2]=A,A>>>0<=255)r=3920+(-8&A)|0,(n=f[970])&(A=1<<(A>>>3))?A=f[r+8>>2]:(f[970]=A|n,A=r),f[r+8>>2]=b,f[A+12>>2]=b,f[b+12>>2]=r,f[b+8>>2]=A;else{o=31,A>>>0<=16777215&&(o=62+((A>>>38-(r=g(A>>>8|0))&1)-(r<<1)|0)|0),f[b+28>>2]=o,f[b+16>>2]=0,f[b+20>>2]=0,r=4184+(o<<2)|0;i:{if((i=f[971])&(n=1<<o)){for(o=A<<(31!=(0|o)?25-(o>>>1|0)|0:0),n=f[r>>2];;){if(r=n,(-8&f[n+4>>2])==(0|A))break i;if(n=o>>>29|0,o<<=1,!(n=f[(i=(4&n)+r|0)+16>>2]))break}f[i+16>>2]=b}else f[971]=n|i,f[r>>2]=b;f[b+24>>2]=r,f[b+12>>2]=b,f[b+8>>2]=b;break n}A=f[r+8>>2],f[A+12>>2]=b,f[r+8>>2]=b,f[b+24>>2]=0,f[b+12>>2]=r,f[b+8>>2]=A}}A=s+8|0;break A}r:if(u){r=f[i+28>>2];n:{if(f[(A=4184+(r<<2)|0)>>2]==(0|i)){if(f[A>>2]=n,n)break n;s=E(r)&s,f[971]=s;break r}if(f[u+(f[u+16>>2]==(0|i)?16:20)>>2]=n,!n)break r}f[n+24>>2]=u,(A=f[i+16>>2])&&(f[n+16>>2]=A,f[A+24>>2]=n),(A=f[i+20>>2])&&(f[n+20>>2]=A,f[A+24>>2]=n)}r:if(o>>>0<=15)A=o+c|0,f[i+4>>2]=3|A,f[(A=A+i|0)+4>>2]=1|f[A+4>>2];else if(f[i+4>>2]=3|c,f[(t=i+c|0)+4>>2]=1|o,f[t+o>>2]=o,o>>>0<=255)r=3920+(-8&o)|0,(n=f[970])&(A=1<<(o>>>3))?A=f[r+8>>2]:(f[970]=A|n,A=r),f[r+8>>2]=t,f[A+12>>2]=t,f[t+12>>2]=r,f[t+8>>2]=A;else{A=31,o>>>0<=16777215&&(A=62+((o>>>38-(A=g(o>>>8|0))&1)-(A<<1)|0)|0),f[t+28>>2]=A,f[t+16>>2]=0,f[t+20>>2]=0,r=4184+(A<<2)|0;n:{if((n=1<<A)&s){for(A=o<<(31!=(0|A)?25-(A>>>1|0)|0:0),c=f[r>>2];;){if((-8&f[(r=c)+4>>2])==(0|o))break n;if(n=A>>>29|0,A<<=1,!(c=f[(n=(4&n)+r|0)+16>>2]))break}f[n+16>>2]=t}else f[971]=n|s,f[r>>2]=t;f[t+24>>2]=r,f[t+12>>2]=t,f[t+8>>2]=t;break r}A=f[r+8>>2],f[A+12>>2]=t,f[r+8>>2]=t,f[t+24>>2]=0,f[t+12>>2]=r,f[t+8>>2]=A}A=i+8|0;break A}e:if(b){r=f[n+28>>2];r:{if(f[(A=4184+(r<<2)|0)>>2]==(0|n)){if(f[A>>2]=i,i)break r;f[971]=E(r)&s;break e}if(f[b+(f[b+16>>2]==(0|n)?16:20)>>2]=i,!i)break e}f[i+24>>2]=b,(A=f[n+16>>2])&&(f[i+16>>2]=A,f[A+24>>2]=i),(A=f[n+20>>2])&&(f[i+20>>2]=A,f[A+24>>2]=i)}o>>>0<=15?(A=o+c|0,f[n+4>>2]=3|A,f[(A=A+n|0)+4>>2]=1|f[A+4>>2]):(f[n+4>>2]=3|c,f[(i=n+c|0)+4>>2]=1|o,f[i+o>>2]=o,l&&(r=3920+(-8&l)|0,t=f[975],(A=1<<(l>>>3))&u?A=f[r+8>>2]:(f[970]=A|u,A=r),f[r+8>>2]=t,f[A+12>>2]=t,f[t+12>>2]=r,f[t+8>>2]=A),f[975]=i,f[972]=o),A=n+8|0}return C=e+16|0,0|A}function m(A){var e,r=0,n=0,i=0,t=0,a=0,k=0,g=0,d=0,p=0,B=0,m=0,D=0,y=0,M=0,E=0,U=0,Y=0,K=0,J=0,O=0,P=0,F=0,N=0,R=0,S=0;C=e=C-16|0,b(+A),r=0|o(1),o(0);A:if((r&=2147483647)>>>0<=1072243195){if(i=1,r>>>0<1044816030)break A;i=I(A,0)}else if(i=A-A,!(r>>>0>=2146435072)){C=B=C-48|0,b(+A),r=0|o(1),t=0|o(0),y=r;e:{r:{n:{if((a=2147483647&r)>>>0<=1074752122){if(598523==(1048575&r))break n;if(a>>>0<=1073928572){if((0|y)>0|(0|y)>=0){i=(A+=-1.5707963267341256)+-6077100506506192e-26,s[e>>3]=i,s[e+8>>3]=A-i-6077100506506192e-26,n=1;break e}i=(A+=1.5707963267341256)+6077100506506192e-26,s[e>>3]=i,s[e+8>>3]=A-i+6077100506506192e-26,n=-1;break e}if((0|y)>0|(0|y)>=0){i=(A+=-3.1415926534682512)+-1.2154201013012384e-10,s[e>>3]=i,s[e+8>>3]=A-i-1.2154201013012384e-10,n=2;break e}i=(A+=3.1415926534682512)+1.2154201013012384e-10,s[e>>3]=i,s[e+8>>3]=A-i+1.2154201013012384e-10,n=-2;break e}if(a>>>0<=1075594811){if(a>>>0<=1075183036){if(1074977148==(0|a))break n;if((0|y)>0|(0|y)>=0){i=(A+=-4.712388980202377)+-1.8231301519518578e-10,s[e>>3]=i,s[e+8>>3]=A-i-1.8231301519518578e-10,n=3;break e}i=(A+=4.712388980202377)+1.8231301519518578e-10,s[e>>3]=i,s[e+8>>3]=A-i+1.8231301519518578e-10,n=-3;break e}if(1075388923==(0|a))break n;if((0|y)>0|(0|y)>=0){i=(A+=-6.2831853069365025)+-2.430840202602477e-10,s[e>>3]=i,s[e+8>>3]=A-i-2.430840202602477e-10,n=4;break e}i=(A+=6.2831853069365025)+2.430840202602477e-10,s[e>>3]=i,s[e+8>>3]=A-i+2.430840202602477e-10,n=-4;break e}if(a>>>0>1094263290)break r}r=(O=(i=A+-1.5707963267341256*(d=.6366197723675814*A+6755399441055744-6755399441055744))-(p=6077100506506192e-26*d))<-.7853981633974483,n=w(d)<2147483648?~~d:-2147483648,r?(n=n-1|0,p=6077100506506192e-26*(d+=-1),i=A+-1.5707963267341256*d):O>.7853981633974483&&(n=n+1|0,p=6077100506506192e-26*(d+=1),i=A+-1.5707963267341256*d),A=i-p,s[e>>3]=A,b(+A),r=0|o(1),o(0),((t=a>>>20|0)-(r>>>20&2047)|0)<17||(p=i,A=(i-=A=6077100506303966e-26*d)-(p=20222662487959506e-37*d-(p-i-A)),s[e>>3]=A,b(+A),r=0|o(1),o(0),(t-(r>>>20&2047)|0)<50||(p=i,A=(i-=A=20222662487111665e-37*d)-(p=84784276603689e-45*d-(p-i-A)),s[e>>3]=A)),s[e+8>>3]=i-A-p;break e}if(a>>>0>=2146435072)A-=A,s[e>>3]=A,s[e+8>>3]=A;else{for(u(0,0|t),u(1,1048575&y|1096810496),A=+c(),r=1;t=(B+16|0)+(n<<3)|0,i=+(0|(n=w(A)<2147483648?~~A:-2147483648)),s[t>>3]=i,A=16777216*(A-i),n=1,t=r,r=0,t;);for(s[B+32>>3]=A,n=2;n=(r=n)-1|0,0==s[(B+16|0)+(r<<3)>>3];);if(P=B+16|0,t=0,C=k=C-560|0,a=l(J=(0|(a=((n=(a>>>20|0)-1046|0)-3|0)/24|0))>0?a:0,-24)+n|0,((M=f[257])+(g=(E=r+1|0)-1|0)|0)>=0)for(n=M+E|0,r=J-g|0;s[(k+320|0)+(t<<3)>>3]=(0|r)<0?0:+f[1040+(r<<2)>>2],r=r+1|0,(0|n)!=(0|(t=t+1|0)););for(m=a-24|0,n=0,t=(0|M)>0?M:0,D=(0|E)<=0;;){if(D)A=0;else for(Y=n+g|0,r=0,A=0;A=s[(r<<3)+P>>3]*s[(k+320|0)+(Y-r<<3)>>3]+A,(0|E)!=(0|(r=r+1|0)););if(s[(n<<3)+k>>3]=A,r=(0|n)==(0|t),n=n+1|0,r)break}R=47-a|0,Y=48-a|0,S=a-25|0,n=M;r:{for(;;){if(A=s[(n<<3)+k>>3],r=0,t=n,!(U=(0|n)<=0))for(;D=(k+480|0)+(r<<2)|0,g=w(i=5.960464477539063e-8*A)<2147483648?~~i:-2147483648,g=w(A=-16777216*(i=+(0|g))+A)<2147483648?~~A:-2147483648,f[D>>2]=g,A=s[((t=t-1|0)<<3)+k>>3]+i,(0|n)!=(0|(r=r+1|0)););A=Q(A,m),A+=-8*h(.125*A),A-=+(0|(D=w(A)<2147483648?~~A:-2147483648));n:{i:{t:{if(F=(0|m)<=0){if(m)break t;g=f[476+((n<<2)+k|0)>>2]>>23}else K=t=(n<<2)+k|0,t=(g=f[t+476>>2])-((r=g>>Y)<<Y)|0,f[K+476>>2]=t,D=r+D|0,g=t>>R;if((0|g)<=0)break n;break i}if(g=2,!(A>=.5)){g=0;break n}}if(r=0,t=0,!U)for(;U=f[(K=(k+480|0)+(r<<2)|0)>>2],N=16777215,t||(N=16777216,U)?(f[K>>2]=N-U,t=1):t=0,(0|n)!=(0|(r=r+1|0)););i:if(!F){r=8388607;t:switch(0|S){case 1:r=4194303;break;case 0:break t;default:break i}f[(U=(n<<2)+k|0)+476>>2]=f[U+476>>2]&r}D=D+1|0,2==(0|g)&&(A=1-A,g=2,t&&(A-=Q(1,m)))}if(0!=A)break;if(t=0,!((0|M)>=(0|(r=n)))){for(;t=f[(k+480|0)+((r=r-1|0)<<2)>>2]|t,(0|r)>(0|M););if(t){for(a=m;a=a-24|0,!f[(k+480|0)+((n=n-1|0)<<2)>>2];);break r}}for(r=1;t=r,r=r+1|0,!f[(k+480|0)+(M-t<<2)>>2];);for(t=n+t|0;;){if(g=n+E|0,n=n+1|0,s[(k+320|0)+(g<<3)>>3]=f[1040+(J+n<<2)>>2],r=0,A=0,(0|E)>0)for(;A=s[(r<<3)+P>>3]*s[(k+320|0)+(g-r<<3)>>3]+A,(0|E)!=(0|(r=r+1|0)););if(s[(n<<3)+k>>3]=A,!((0|n)<(0|t)))break}n=t}(A=Q(A,24-a|0))>=16777216?(m=(k+480|0)+(n<<2)|0,r=w(i=5.960464477539063e-8*A)<2147483648?~~i:-2147483648,t=w(A=-16777216*+(0|r)+A)<2147483648?~~A:-2147483648,f[m>>2]=t,n=n+1|0):(r=w(A)<2147483648?~~A:-2147483648,a=m),f[(k+480|0)+(n<<2)>>2]=r}if(A=Q(1,a),!((0|n)<0)){for(r=n;t=r,s[(r<<3)+k>>3]=A*+f[(k+480|0)+(r<<2)>>2],r=r-1|0,A*=5.960464477539063e-8,t;);if(!((0|n)<0))for(t=n;;){if(A=0,r=0,(0|(m=(0|(a=n-t|0))>(0|M)?M:a))>=0)for(;A=s[3808+(r<<3)>>3]*s[(r+t<<3)+k>>3]+A,E=(0|r)!=(0|m),r=r+1|0,E;);if(s[(k+160|0)+(a<<3)>>3]=A,r=(0|t)>0,t=t-1|0,!r)break}}if(A=0,(0|n)>=0)for(r=n;t=r,r=r-1|0,A+=s[(k+160|0)+(t<<3)>>3],t;);if(s[B>>3]=g?-A:A,A=s[k+160>>3]-A,r=1,(0|n)>0)for(;A+=s[(k+160|0)+(r<<3)>>3],t=(0|r)!=(0|n),r=r+1|0,t;);s[B+8>>3]=g?-A:A,C=k+560|0,n=7&D,A=s[B>>3],(0|y)<0?(s[e>>3]=-A,s[e+8>>3]=-s[B+8>>3],n=0-n|0):(s[e>>3]=A,s[e+8>>3]=s[B+8>>3])}}C=B+48|0;e:switch(3&n){case 0:i=I(s[e>>3],s[e+8>>3]);break A;case 1:i=-v(s[e>>3],s[e+8>>3]);break A;case 2:i=-I(s[e>>3],s[e+8>>3]);break A;default:break e}i=v(s[e>>3],s[e+8>>3])}return C=e+16|0,i}function D(A){var e=0,r=0,n=0,i=0,t=0,a=0,o=0;A:if(A|=0){t=(n=A-8|0)+(A=-8&(e=f[A-4>>2]))|0;e:if(!(1&e)){if(!(3&e))break A;if((n=n-(e=f[n>>2])|0)>>>0<k[974])break A;A=A+e|0;r:{n:{if(f[975]!=(0|n)){if(e>>>0<=255){if(i=e>>>3|0,(0|(e=f[n+12>>2]))==(0|(r=f[n+8>>2]))){f[970]=f[970]&E(i);break e}f[r+12>>2]=e,f[e+8>>2]=r;break e}if(a=f[n+24>>2],(0|n)!=(0|(e=f[n+12>>2]))){r=f[n+8>>2],f[r+12>>2]=e,f[e+8>>2]=r;break r}if(!(r=f[(i=n+20|0)>>2])){if(!(r=f[n+16>>2]))break n;i=n+16|0}for(;o=i,(r=f[(i=(e=r)+20|0)>>2])||(i=e+16|0,r=f[e+16>>2]););f[o>>2]=0;break r}if(3!=(3&(e=f[t+4>>2])))break e;return f[972]=A,f[t+4>>2]=-2&e,f[n+4>>2]=1|A,void(f[t>>2]=A)}e=0}if(a){r=f[n+28>>2];r:{if(f[(i=4184+(r<<2)|0)>>2]==(0|n)){if(f[i>>2]=e,e)break r;f[971]=f[971]&E(r);break e}if(f[a+(f[a+16>>2]==(0|n)?16:20)>>2]=e,!e)break e}f[e+24>>2]=a,(r=f[n+16>>2])&&(f[e+16>>2]=r,f[r+24>>2]=e),(r=f[n+20>>2])&&(f[e+20>>2]=r,f[r+24>>2]=e)}}if(!(n>>>0>=t>>>0)&&1&(e=f[t+4>>2])){e:{r:{n:{i:{if(!(2&e)){if(f[976]==(0|t)){if(f[976]=n,A=f[973]+A|0,f[973]=A,f[n+4>>2]=1|A,f[975]!=(0|n))break A;return f[972]=0,void(f[975]=0)}if(f[975]==(0|t))return f[975]=n,A=f[972]+A|0,f[972]=A,f[n+4>>2]=1|A,void(f[A+n>>2]=A);if(A=(-8&e)+A|0,e>>>0<=255){if(i=e>>>3|0,(0|(e=f[t+12>>2]))==(0|(r=f[t+8>>2]))){f[970]=f[970]&E(i);break r}f[r+12>>2]=e,f[e+8>>2]=r;break r}if(a=f[t+24>>2],(0|t)!=(0|(e=f[t+12>>2]))){r=f[t+8>>2],f[r+12>>2]=e,f[e+8>>2]=r;break n}if(!(r=f[(i=t+20|0)>>2])){if(!(r=f[t+16>>2]))break i;i=t+16|0}for(;o=i,(r=f[(i=(e=r)+20|0)>>2])||(i=e+16|0,r=f[e+16>>2]););f[o>>2]=0;break n}f[t+4>>2]=-2&e,f[n+4>>2]=1|A,f[A+n>>2]=A;break e}e=0}if(a){r=f[t+28>>2];n:{if(f[(i=4184+(r<<2)|0)>>2]==(0|t)){if(f[i>>2]=e,e)break n;f[971]=f[971]&E(r);break r}if(f[a+(f[a+16>>2]==(0|t)?16:20)>>2]=e,!e)break r}f[e+24>>2]=a,(r=f[t+16>>2])&&(f[e+16>>2]=r,f[r+24>>2]=e),(r=f[t+20>>2])&&(f[e+20>>2]=r,f[r+24>>2]=e)}}if(f[n+4>>2]=1|A,f[A+n>>2]=A,f[975]==(0|n))return void(f[972]=A)}if(A>>>0<=255)return e=3920+(-8&A)|0,(r=f[970])&(A=1<<(A>>>3))?A=f[e+8>>2]:(f[970]=A|r,A=e),f[e+8>>2]=n,f[A+12>>2]=n,f[n+12>>2]=e,void(f[n+8>>2]=A);r=31,A>>>0<=16777215&&(r=62+((A>>>38-(e=g(A>>>8|0))&1)-(e<<1)|0)|0),f[n+28>>2]=r,f[n+16>>2]=0,f[n+20>>2]=0,e=4184+(r<<2)|0;e:{r:{if((i=f[971])&(o=1<<r)){for(r=A<<(31!=(0|r)?25-(r>>>1|0)|0:0),e=f[e>>2];;){if(i=e,(-8&f[e+4>>2])==(0|A))break r;if(e=r>>>29|0,r<<=1,!(e=f[(o=i+(4&e)|0)+16>>2]))break}f[o+16>>2]=n,f[n+24>>2]=i}else f[971]=i|o,f[e>>2]=n,f[n+24>>2]=e;f[n+12>>2]=n,f[n+8>>2]=n;break e}A=f[i+8>>2],f[A+12>>2]=n,f[i+8>>2]=n,f[n+24>>2]=0,f[n+12>>2]=i,f[n+8>>2]=A}A=f[978]-1|0,f[978]=A||-1}}}function Q(A,e){A:if((0|e)>=1024){if(A*=898846567431158e293,e>>>0<2047){e=e-1023|0;break A}A*=898846567431158e293,e=((0|e)>=3069?3069:e)-2046|0}else(0|e)>-1023||(A*=2004168360008973e-307,e>>>0>4294965304?e=e+969|0:(A*=2004168360008973e-307,e=((0|e)<=-2960?-2960:e)+1938|0));return u(0,0),u(1,e+1023<<20),A*+c()}function I(A,e){var r,n,i=0;return(n=1-(i=.5*(r=A*A)))+(1-n-i+(r*(r*(r*(2480158728947673e-20*r-.001388888888887411)+.0416666666666666)+(i=r*r)*i*(r*(-11359647557788195e-27*r+2.087572321298175e-9)-2.7557314351390663e-7))-A*e))}function v(A,e){var r,n;return A-((r=A*A)*(.5*e-(r*(r*r)*(1.58969099521155e-10*r-2.5050760253406863e-8)+(r*(27557313707070068e-22*r-.0001984126982985795)+.00833333333332249))*(n=r*A))-e+.16666666666666632*n)}function y(A){var e,r;return(A=(e=f[968])+(r=A+7&-8)|0)>>>0<=e>>>0&&r||A>>>0>(n.byteLength/65536|0)<<16>>>0&&!(0|d(0|A))?(f[969]=48,-1):(f[968]=A,e)}function M(A){var e=0;A=A>>>0<=1?1:A;A:{for(;;){if(e=B(A))break A;if(!(e=f[1094]))break;K[0|e]()}p(),function(){throw new Error("abort")}()}return e}function E(A){var e;return(-1>>>(e=31&A)&-2)<<e|(-1<<(A=0-A&31)&-2)>>>A}function U(A){return A?31-g(A-1^A)|0:32}i(e=a,1024,"AwAAAAQAAAAEAAAABgAAAIP5ogBETm4A/CkVANFXJwDdNPUAYtvAADyZlQBBkEMAY1H+ALveqwC3YcUAOm4kANJNQgBJBuAACeouAByS0QDrHf4AKbEcAOg+pwD1NYIARLsuAJzphAC0JnAAQX5fANaROQBTgzkAnPQ5AItfhAAo+b0A+B87AN7/lwAPmAUAES/vAApaiwBtH20Az342AAnLJwBGT7cAnmY/AC3qXwC6J3UA5evHAD178QD3OQcAklKKAPtr6gAfsV8ACF2NADADVgB7/EYA8KtrACC8zwA29JoA46kdAF5hkQAIG+YAhZllAKAUXwCNQGgAgNj/ACdzTQAGBjEAylYVAMmocwB74mAAa4zAABnERwDNZ8MACejcAFmDKgCLdsQAphyWAESv3QAZV9EApT4FAAUH/wAzfj8AwjLoAJhP3gC7fTIAJj3DAB5r7wCf+F4ANR86AH/yygDxhx0AfJAhAGokfADVbvoAMC13ABU7QwC1FMYAwxmdAK3EwgAsTUEADABdAIZ9RgDjcS0Am8aaADNiAAC00nwAtKeXADdV1QDXPvYAoxAYAE12/ABknSoAcNerAGN8+AB6sFcAFxXnAMBJVgA71tkAp4Q4ACQjywDWincAWlQjAAAfuQDxChsAGc7fAJ8x/wBmHmoAmVdhAKz7RwB+f9gAImW3ADLoiQDmv2AA78TNAGw2CQBdP9QAFt7XAFg73gDem5IA0iIoACiG6ADiWE0AxsoyAAjjFgDgfcsAF8BQAPMdpwAY4FsALhM0AIMSYgCDSAEA9Y5bAK2wfwAe6fIASEpDABBn0wCq3dgArl9CAGphzgAKKKQA05m0AAam8gBcd38Ao8KDAGE8iACKc3gAr4xaAG/XvQAtpmMA9L/LAI2B7wAmwWcAVcpFAMrZNgAoqNIAwmGNABLJdwAEJhQAEkabAMRZxADIxUQATbKRAAAX8wDUQ60AKUnlAP3VEAAAvvwAHpTMAHDO7gATPvUA7PGAALPnwwDH+CgAkwWUAMFxPgAuCbMAC0XzAIgSnACrIHsALrWfAEeSwgB7Mi8ADFVtAHKnkABr5x8AMcuWAHkWSgBBeeIA9N+JAOiUlwDi5oQAmTGXAIjtawBfXzYAu/0OAEiatABnpGwAcXJCAI1dMgCfFbgAvOUJAI0xJQD3dDkAMAUcAA0MAQBLCGgALO5YAEeqkAB05wIAvdYkAPd9pgBuSHIAnxbvAI6UpgC0kfYA0VNRAM8K8gAgmDMA9Ut+ALJjaADdPl8AQF0DAIWJfwBVUikAN2TAAG3YEAAySDIAW0x1AE5x1ABFVG4ACwnBACr1aQAUZtUAJwedAF0EUAC0O9sA6nbFAIf5FwBJa30AHSe6AJZpKQDGzKwArRRUAJDiagCI2YkALHJQAASkvgB3B5QA8zBwAAD8JwDqcagAZsJJAGTgPQCX3YMAoz+XAEOU/QANhowAMUHeAJI5nQDdcIwAF7fnAAjfOwAVNysAXICgAFqAkwAQEZIAD+jYAGyArwDb/0sAOJAPAFkYdgBipRUAYcu7AMeJuQAQQL0A0vIEAEl1JwDrtvYA2yK7AAoUqgCJJi8AZIN2AAk7MwAOlBoAUTqqAB2jwgCv7a4AXCYSAG3CTQAtepwAwFaXAAM/gwAJ8PYAK0CMAG0xmQA5tAcADCAVANjDWwD1ksQAxq1LAE7KpQCnN80A5qk2AKuSlADdQmgAGWPeAHaM7wBoi1IA/Ns3AK6hqwDfFTEAAK6hAAz72gBkTWYA7QW3ACllMABXVr8AR/86AGr5uQB1vvMAKJPfAKuAMABmjPYABMsVAPoiBgDZ5B0APbOkAFcbjwA2zQkATkLpABO+pAAzI7UA8KoaAE9lqADSwaUACz8PAFt4zQAj+XYAe4sEAIkXcgDGplMAb27iAO/rAACbSlgAxNq3AKpmugB2z88A0QIdALHxLQCMmcEAw613AIZI2gD3XaAAxoD0AKzwLwDd7JoAP1y8ANDebQCQxx8AKtu2AKMlOgAAr5oArVOTALZXBAApLbQAS4B+ANoHpwB2qg4Ae1mhABYSKgDcty0A+uX9AInb/gCJvv0A5HZsAAap/AA+gHAAhW4VAP2H/wAoPgcAYWczACoYhgBNveoAs+evAI9tbgCVZzkAMb9bAITXSAAw3xYAxy1DACVhNQDJcM4AMMu4AL9s/QCkAKIABWzkAFrdoAAhb0cAYhLSALlchABwYUkAa1bgAJlSAQBQVTcAHtW3ADPxxAATbl8AXTDkAIUuqQAdssMAoTI2AAi3pADqsdQAFvchAI9p5AAn/3cADAOAAI1ALQBPzaAAIKWZALOi0wAvXQoAtPlCABHaywB9vtAAm9vBAKsXvQDKooEACGpcAC5VFwAnAFUAfxTwAOEHhgAUC2QAlkGNAIe+3gDa/SoAayW2AHuJNAAF8/4Aub+eAGhqTwBKKqgAT8RaAC34vADXWpgA9MeVAA1NjQAgOqYApFdfABQ/sQCAOJUAzCABAHHdhgDJ3rYAv2D1AE1lEQABB2sAjLCsALLA0ABRVUgAHvsOAJVywwCjBjsAwEA1AAbcewDgRcwATin6ANbKyADo80EAfGTeAJtk2ADZvjEApJfDAHdY1ABp48UA8NoTALo6PABGGEYAVXVfANK99QBuksYArC5dAA5E7QAcPkIAYcSHACn96QDn1vMAInzKAG+RNQAI4MUA/9eNAG5q4gCw/cYAkwjBAHxddABrrbIAzW6dAD5yewDGEWoA98+pAClz3wC1yboAtwBRAOKyDQB0uiQA5X1gAHTYigANFSwAgRgMAH5mlAABKRYAn3p2AP39vgBWRe8A2X42AOzZEwCLurkAxJf8ADGoJwDxbsMAlMU2ANioVgC0qLUAz8wOABKJLQBvVzQALFaJAJnO4wDWILkAa16qAD4qnAARX8wA/QtKAOH0+wCOO20A4oYsAOnUhAD8tKkA7+7RAC41yQAvOWEAOCFEABvZyACB/AoA+0pqAC8c2ABTtIQATpmMAFQizAAqVdwAwMbWAAsZlgAacLgAaZVkACZaYAA/Uu4AfxEPAPS1EQD8y/UANLwtADS87gDoXcwA3V5gAGeOmwCSM+8AyRe4AGFYmwDhV7wAUYPGANg+EADdcUgALRzdAK8YoQAhLEYAWfPXANl6mACeVMAAT4b6AFYG/ADlea4AiSI2ADitIgBnk9wAVeiqAIImOADK55sAUQ2kAJkzsQCp1w4AaQVIAGWy8AB/iKcAiEyXAPnRNgAhkrMAe4JKAJjPIQBAn9wA3EdVAOF0OgBn60IA/p3fAF7UXwB7Z6QAuqx6AFX2ogAriCMAQbpVAFluCAAhKoYAOUeDAInj5gDlntQASftAAP9W6QAcD8oAxVmKAJT6KwDTwcUAD8XPANtargBHxYYAhUNiACGGOwAseZQAEGGHACpMewCALBoAQ78SAIgmkAB4PIkAqMTkAOXbewDEOsIAJvTqAPdnigANkr8AZaMrAD2TsQC9fAsApFHcACfdYwBp4d0AmpQZAKgplQBozigACe20AESfIABOmMoAcIJjAH58IwAPuTIAp/WOABRW5wAh8QgAtZ0qAG9+TQClGVEAtfmrAILf1gCW3WEAFjYCAMQ6nwCDoqEAcu1tADmNegCCuKkAazJcAEYnWwAANO0A0gB3APz0VQABWU0A4HGA"),i(e,3811,"QPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNQ=="),i(e,3872,"IBEB");var Y,K=((Y=[]).set=function(A,e){this[A]=e},Y.get=function(A){return this[A]},Y);return{d:function(){},e:function(A){A|=0;var e,r,n,i,a=0,o=0,u=0,c=0,b=0,k=0,l=0,w=0,g=0,h=0,d=0;if(r=M(12),b=1&(l=(u=A>>>2|0)+1|0),e=A,i=+(A>>>0),n=M(A>>>0>2147483643?-1:8+(u<<3)|0),A>>>0>=4)for(A=2147483646&l;s[(a<<3)+n>>3]=m(6.283185307179586*+(a>>>0)/i),s[((u=1|a)<<3)+n>>3]=m(6.283185307179586*+(u>>>0)/i),a=a+2|0,(0|A)!=(0|(k=k+2|0)););if(b&&(s[(a<<3)+n>>3]=m(6.283185307179586*+(a>>>0)/i)),k=1,l=e>>>1|0,b=M((0|e)<0?-1:l<<2),!(e>>>0<2)){if(A=(l>>>0<=1?1:l)<<2){if(A>>>0>=8)for(a=-8&A,u=0;t[o+b|0]=0,t[b+(1|o)|0]=0,t[b+(2|o)|0]=0,t[b+(3|o)|0]=0,t[b+(4|o)|0]=0,t[b+(5|o)|0]=0,t[b+(6|o)|0]=0,t[b+(7|o)|0]=0,o=o+8|0,(0|a)!=(0|(u=u+8|0)););if(A&=7)for(;t[o+b|0]=0,o=o+1|0,(0|A)!=(0|(c=c+1|0)););}if(!(e>>>0<4))for(A=l;;){for(g=A-(o=A>>>1|0)&3,d=(-1^o)+A|0,w=0,u=A;;){if(!((a=o+w|0)>>>0>=(w=A+w|0)>>>0)){if(c=0,g)for(;f[(h=b+(a<<2)|0)>>2]=f[h>>2]+k,a=a+1|0,(0|g)!=(0|(c=c+1|0)););if(!(d>>>0<3))for(;f[(c=b+(a<<2)|0)>>2]=f[c>>2]+k,f[c+4>>2]=f[c+4>>2]+k,f[c+8>>2]=f[c+8>>2]+k,f[c+12>>2]=f[c+12>>2]+k,(0|u)!=(0|(a=a+4|0)););}if(u=A+u|0,!(l>>>0>w>>>0))break}if(k<<=1,u=A>>>0>3,A=o,!u)break}}return f[r+8>>2]=b,f[r+4>>2]=n,f[r>>2]=e,0|r},f:function(A,e,r,n){e|=0,r|=0,n|=0;var i=0,t=0,a=0,o=0,u=0,c=0,b=0,k=0,w=0,g=0,h=0,d=0,p=0,C=0,B=0,m=0,D=0,Q=0,I=0;A:{e:{r:{n:switch((k=f[(A|=0)>>2])-1|0){case 0:break e;case 1:break n;default:break r}g=s[e+24>>3],u=s[e+8>>3],c=s[e>>3],b=s[e+16>>3],s[r+16>>3]=c-b,s[r>>3]=c+b,s[r+24>>3]=u-g,s[r+8>>3]=u+g;break A}if(!k)break A;for(t=k>>>1|0,i=f[A+8>>2],m=f[A+4>>2],A=0;o=f[i+(A<<1)>>2],g=s[(w=(o<<4)+e|0)>>3],u=s[(o=(t+o<<4)+e|0)>>3],a=(h=A<<4)+r|0,c=s[w+8>>3],b=s[o+8>>3],s[a+8>>3]=c+b,s[a>>3]=g+u,s[(o=(16|h)+r|0)+8>>3]=c-b,s[o>>3]=g-u,k>>>0>(A=A+2|0)>>>0;);if(k>>>0<4)break A;for(g=+(0-n|0),I=+(0|n),w=2,h=o=k>>>2|0;;){for(e=w>>>1|0,A=0;u=s[(n=((t=A+e|0)<<4)+r|0)>>3],p=s[(t=((a=(i=e+t|0)+e|0)<<4)+r|0)+8>>3],c=s[n+8>>3],C=s[t>>3],b=s[(i=(i<<4)+r|0)>>3],d=s[(A=(A<<4)+r|0)+8>>3],B=s[i+8>>3],s[A+8>>3]=d+B,D=s[A>>3],s[A>>3]=b+D,C*=g,s[n+8>>3]=c+C,p*=I,s[n>>3]=u+p,s[i+8>>3]=d-B,s[i>>3]=D-b,s[t+8>>3]=c-C,s[t>>3]=u-p,n=0,k>>>0>(A=e+a|0)>>>0;);for(t=e,A=o;;){if(A=A-h|0,t>>>0>(n=n+1|0)>>>0)for(;;){if(n>>>0<k>>>0)for(a=l(i=A>>30|1,A),u=s[(o-a<<3)+m>>3]*+(0|i),c=s[(a<<3)+m>>3]*g,i=n;b=s[(a=(i<<4)+r|0)+8>>3],C=(d=s[(i=((Q=i+w|0)<<4)+r|0)>>3])*c+u*(p=s[i+8>>3]),s[a+8>>3]=b+C,B=s[a>>3],d=d*u-c*p,s[a>>3]=B+d,s[i+8>>3]=b-C,s[i>>3]=B-d,k>>>0>(i=w+Q|0)>>>0;);if(A=A-h|0,!(t>>>0>(n=n+1|0)>>>0))break}if(!(w>>>0>=(t=e+t|0)>>>0))break}if(w<<=1,A=h>>>0<2,h=h>>>1|0,A)break}break A}A=f[e+4>>2],f[r>>2]=f[e>>2],f[r+4>>2]=A,A=f[e+12>>2],f[r+8>>2]=f[e+8>>2],f[r+12>>2]=A}},g:function(A){var e=0;(A|=0)&&((e=f[A+4>>2])&&D(e),(e=f[A+8>>2])&&D(e),D(A))},h:K,i:B,j:D}}(A)}(e)},instantiate:function(A,e){return{then:function(r){var n=new c.Module(A);r({instance:new c.Instance(n,e)})}}},RuntimeError:Error};a=[],"object"!=typeof c&&y("no native wasm support detected");var b,k,s,l,w,g,h,d=!1;var p,C=e.INITIAL_MEMORY||16777216;p="INITIAL_MEMORY should be larger than STACK_SIZE, was "+C+"! (STACK_SIZE=65536)",C>=65536||y(p),u=e.wasmMemory?e.wasmMemory:new c.Memory({initial:C/65536,maximum:C/65536}),function(){var A=u.buffer;e.HEAP8=b=new Int8Array(A),e.HEAP16=s=new Int16Array(A),e.HEAP32=l=new Int32Array(A),e.HEAPU8=k=new Uint8Array(A),e.HEAPU16=new Uint16Array(A),e.HEAPU32=w=new Uint32Array(A),e.HEAPF32=g=new Float32Array(A),e.HEAPF64=h=new Float64Array(A)}(),C=u.buffer.byteLength;var B=[],m=[],D=[];var Q=0,I=null,v=null;function y(A){e.onAbort&&e.onAbort(A),o(A="Aborted("+A+")"),d=!0,1,A+=". Build with -sASSERTIONS for more info.";var r=new c.RuntimeError(A);throw n(r),r}var M,E,U,Y,K="data:application/octet-stream;base64,";function J(A){return A.startsWith(K)}function O(A){try{if(A==M&&a)return new Uint8Array(a);var e=R(A);if(e)return e;if(i)return i(A);throw"both async and sync fetching of the wasm failed"}catch(o){y(o)}}function P(A,e,r){return function(A){return a||"function"!=typeof fetch?Promise.resolve().then((function(){return O(A)})):fetch(A,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+A+"'";return e.arrayBuffer()})).catch((function(){return O(A)}))}(A).then((function(A){return c.instantiate(A,e)})).then((function(A){return A})).then(r,(function(A){o("failed to asynchronously prepare wasm: "+A),y(A)}))}function F(A){for(;A.length>0;)A.shift()(e)}J(M="fft99c.wasm")||(E=M,M=e.locateFile?e.locateFile(E,f):f+E);var N="function"==typeof atob?atob:function(A){var e,r,n,i,t,f,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",o="",u=0;A=A.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{e=a.indexOf(A.charAt(u++))<<2|(i=a.indexOf(A.charAt(u++)))>>4,r=(15&i)<<4|(t=a.indexOf(A.charAt(u++)))>>2,n=(3&t)<<6|(f=a.indexOf(A.charAt(u++))),o+=String.fromCharCode(e),64!==t&&(o+=String.fromCharCode(r)),64!==f&&(o+=String.fromCharCode(n))}while(u<A.length);return o};function R(A){if(J(A))return function(A){try{for(var e=N(A),r=new Uint8Array(e.length),n=0;n<e.length;++n)r[n]=e.charCodeAt(n);return r}catch(i){throw new Error("Converting base64 string to bytes failed.")}}(A.slice(K.length))}var S,x={c:function(){y("")},b:function(A){k.length,y("OOM")},a:u};(function(){var A,r,i,t,f={a:x};function u(A,r){var n,i=A.exports;return e.asm=i,e.asm.h,n=e.asm.d,m.unshift(n),function(A){if(Q--,e.monitorRunDependencies&&e.monitorRunDependencies(Q),0==Q&&(null!==I&&(clearInterval(I),I=null),v)){var r=v;v=null,r()}}(),i}if(Q++,e.monitorRunDependencies&&e.monitorRunDependencies(Q),e.instantiateWasm)try{return e.instantiateWasm(f,u)}catch(b){o("Module.instantiateWasm callback failed with error: "+b),n(b)}(A=a,r=M,i=f,t=function(A){u(A.instance)},A||"function"!=typeof c.instantiateStreaming||J(r)||"function"!=typeof fetch?P(r,i,t):fetch(r,{credentials:"same-origin"}).then((function(A){return c.instantiateStreaming(A,i).then(t,(function(A){return o("wasm streaming compile failed: "+A),o("falling back to ArrayBuffer instantiation"),P(r,i,t)}))}))).catch(n)})(),e._prepare_fft=function(){return(e._prepare_fft=e.asm.e).apply(null,arguments)},e._run_fft=function(){return(e._run_fft=e.asm.f).apply(null,arguments)},e._delete_fft=function(){return(e._delete_fft=e.asm.g).apply(null,arguments)},e._malloc=function(){return(e._malloc=e.asm.i).apply(null,arguments)},e._free=function(){return(e._free=e.asm.j).apply(null,arguments)};function H(){function A(){S||(S=!0,e.calledRun=!0,d||(!0,F(m),r(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),function(){if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;)A=e.postRun.shift(),D.unshift(A);var A;F(D)}()))}Q>0||(!function(){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)A=e.preRun.shift(),B.unshift(A);var A;F(B)}(),Q>0||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),A()}),1)):A()))}if(e.setValue=function(A,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"i8";switch(r.endsWith("*")&&(r="*"),r){case"i1":case"i8":b[A>>0]=e;break;case"i16":s[A>>1]=e;break;case"i32":l[A>>2]=e;break;case"i64":Y=[e>>>0,(U=e,+Math.abs(U)>=1?U>0?+Math.floor(U/4294967296)>>>0:~~+Math.ceil((U-+(~~U>>>0))/4294967296)>>>0:0)],l[A>>2]=Y[0],l[A+4>>2]=Y[1];break;case"float":g[A>>2]=e;break;case"double":h[A>>3]=e;break;case"*":w[A>>2]=e;break;default:y("invalid type for setValue: ".concat(r))}},e.getValue=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"i8";switch(e.endsWith("*")&&(e="*"),e){case"i1":case"i8":return b[A>>0];case"i16":return s[A>>1];case"i32":case"i64":return l[A>>2];case"float":return g[A>>2];case"double":return h[A>>3];case"*":return w[A>>2];default:y("invalid type for getValue: ".concat(e))}},v=function A(){S||H(),S||(v=A)},e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();return H(),e.ready}(e)}}();"object"===typeof n&&"object"===typeof i?i.exports=t:"function"===typeof define&&define.amd?define([],(function(){return t})):"object"===typeof n&&(n.Module=t),e.default=i.exports}}]);
//# sourceMappingURL=45.ef38e570.chunk.js.map