"use strict";(self.webpackChunkfft_browser_test=self.webpackChunkfft_browser_test||[]).push([[144],{4144:function(A,e,r){r.r(e);var i={},n={exports:i},f=function(){var A="undefined"!==typeof document&&document.currentScript?document.currentScript.src:void 0;return function(e){var r,i;(e="undefined"!=typeof(e=e||{})?e:{}).ready=new Promise((function(A,e){r=A,i=e}));var n,f=Object.assign({},e),a=[],t="";"undefined"!=typeof document&&document.currentScript&&(t=document.currentScript.src),A&&(t=A),t=0!==t.indexOf("blob:")?t.substr(0,t.replace(/[?#].*/,"").lastIndexOf("/")+1):"";e.print||console.log.bind(console);var o,u=e.printErr||console.warn.bind(console);Object.assign(e,f),f=null,e.arguments&&(a=e.arguments),e.thisProgram&&e.thisProgram,e.quit&&e.quit,e.wasmBinary&&(o=e.wasmBinary);e.noExitRuntime;var c,b={Memory:function(A){this.buffer=new ArrayBuffer(65536*A.initial)},Module:function(A){},Instance:function(A,e){this.exports=function(A){for(var e,r=new Uint8Array(123),i=25;i>=0;--i)r[48+i]=52+i,r[65+i]=i,r[97+i]=26+i;function n(A,e,i){for(var n,f,a=0,t=e,o=i.length,u=e+(3*o>>2)-("="==i[o-2])-("="==i[o-1]);a<o;a+=4)n=r[i.charCodeAt(a+1)],f=r[i.charCodeAt(a+2)],A[t++]=r[i.charCodeAt(a)]<<2|n>>4,t<u&&(A[t++]=n<<4|f>>2),t<u&&(A[t++]=f<<6|r[i.charCodeAt(a+3)])}r[43]=62,r[47]=63;var f=new ArrayBuffer(16),a=new Int32Array(f),t=(new Float32Array(f),new Float64Array(f));function o(A){return a[A]}function u(A,e){a[A]=e}function c(){return t[0]}function b(A){t[0]=A}return function(A){var r=A.a.buffer,i=new Int8Array(r),f=(new Int16Array(r),new Int32Array(r)),a=new Uint8Array(r),t=(new Uint16Array(r),new Uint32Array(r)),s=(new Float32Array(r),new Float64Array(r)),k=Math.imul,l=(Math.fround,Math.abs),w=(Math.clz32,Math.min,Math.max,Math.floor),g=(Math.ceil,Math.trunc,Math.sqrt,A.abort),d=A.b,h=A.c,p=5247264;function m(A){var e,r=0,i=0,n=0,o=0,u=0,c=0,b=0,s=0,k=0,l=0;p=e=p-16|0;A:{e:{r:{i:{n:{f:{a:{t:{o:{u:{c:{if((A|=0)>>>0<=244){if(3&(r=(o=f[970])>>>(i=(c=A>>>0<11?16:A+11&-8)>>>3|0)|0)){A=(u=f[(r=(n=i+(1&(-1^r))|0)<<3)+3928>>2])+8|0,(0|(i=f[u+8>>2]))!=(0|(r=r+3920|0))?(f[i+12>>2]=r,f[r+8>>2]=i):f[970]=E(n)&o,r=n<<3,f[u+4>>2]=3|r,f[(r=r+u|0)+4>>2]=1|f[r+4>>2];break A}if((l=f[972])>>>0>=c>>>0)break c;if(r){i=A=(r=(0-(A=(0-(A=2<<i)|A)&r<<i)&A)-1|0)>>>12&16,i|=A=(r=r>>>A|0)>>>5&8,i|=A=(r=r>>>A|0)>>>2&4,k=f[(A=(i=((i|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)|0)<<3)+3928>>2],(0|(r=f[k+8>>2]))!=(0|(A=A+3920|0))?(f[r+12>>2]=A,f[A+8>>2]=r):(o=E(i)&o,f[970]=o),A=k+8|0,f[k+4>>2]=3|c,u=(r=i<<3)-c|0,f[(n=c+k|0)+4>>2]=1|u,f[r+k>>2]=u,l&&(i=3920+((r=l>>>3|0)<<3)|0,k=f[975],(r=1<<r)&o?r=f[i+8>>2]:(f[970]=r|o,r=i),f[i+8>>2]=k,f[r+12>>2]=k,f[k+12>>2]=i,f[k+8>>2]=r),f[975]=n,f[972]=u;break A}if(!(b=f[971]))break c;for(i=A=(r=(0-b&b)-1|0)>>>12&16,i|=A=(r=r>>>A|0)>>>5&8,i|=A=(r=r>>>A|0)>>>2&4,r=f[4184+(((i|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)<<2)>>2],n=(-8&f[r+4>>2])-c|0,i=r;(A=f[i+16>>2])||(A=f[i+20>>2]);)n=(u=(i=(-8&f[A+4>>2])-c|0)>>>0<n>>>0)?i:n,r=u?A:r,i=A;if(s=f[r+24>>2],(0|(u=f[r+12>>2]))!=(0|r)){A=f[r+8>>2],f[A+12>>2]=u,f[u+8>>2]=A;break e}if(!(A=f[(i=r+20|0)>>2])){if(!(A=f[r+16>>2]))break u;i=r+16|0}for(;k=i,u=A,(A=f[(i=A+20|0)>>2])||(i=u+16|0,A=f[u+16>>2]););f[k>>2]=0;break e}if(c=-1,!(A>>>0>4294967231)&&(c=-8&(A=A+11|0),s=f[971])){n=0-c|0,o=0,c>>>0<256||(o=31,c>>>0>16777215||(A=A>>>8|0,A<<=k=A+1048320>>>16&8,o=28+((A=((A<<=i=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|i|k)|0)<<1|c>>>A+21&1)|0));b:{s:{if(i=f[4184+(o<<2)>>2])for(A=0,r=c<<(31==(0|o)?0:25-(o>>>1|0)|0);;){if(!((k=(b=-8&f[i+4>>2])-c|0)>>>0>=n>>>0)&&(n=k,u=i,(0|c)==(0|b))){n=0,A=i;break s}if(k=f[i+20>>2],i=f[16+((r>>>29&4)+i|0)>>2],A=k?(0|k)==(0|i)?A:k:A,r<<=1,!i)break}else A=0;if(!(A|u)){if(u=0,!(A=(0-(A=2<<o)|A)&s))break c;i=A=(r=(A&0-A)-1|0)>>>12&16,i|=A=(r=r>>>A|0)>>>5&8,i|=A=(r=r>>>A|0)>>>2&4,A=f[4184+(((i|=A=(r=r>>>A|0)>>>1&2)|(A=(r=r>>>A|0)>>>1&1))+(r>>>A|0)<<2)>>2]}if(!A)break b}for(;n=(i=(r=(-8&f[A+4>>2])-c|0)>>>0<n>>>0)?r:n,u=i?A:u,A=(r=f[A+16>>2])||f[A+20>>2];);}if(!(!u|f[972]-c>>>0<=n>>>0)){if(o=f[u+24>>2],(0|u)!=(0|(r=f[u+12>>2]))){A=f[u+8>>2],f[A+12>>2]=r,f[r+8>>2]=A;break r}if(!(A=f[(i=u+20|0)>>2])){if(!(A=f[u+16>>2]))break o;i=u+16|0}for(;k=i,r=A,(A=f[(i=A+20|0)>>2])||(i=r+16|0,A=f[r+16>>2]););f[k>>2]=0;break r}}}if((i=f[972])>>>0>=c>>>0){n=f[975],(r=i-c|0)>>>0>=16?(f[972]=r,A=n+c|0,f[975]=A,f[A+4>>2]=1|r,f[i+n>>2]=r,f[n+4>>2]=3|c):(f[975]=0,f[972]=0,f[n+4>>2]=3|i,f[(A=i+n|0)+4>>2]=1|f[A+4>>2]),A=n+8|0;break A}if((s=f[973])>>>0>c>>>0){r=s-c|0,f[973]=r,A=(i=f[976])+c|0,f[976]=A,f[A+4>>2]=1|r,f[i+4>>2]=3|c,A=i+8|0;break A}if(A=0,b=c+47|0,f[1088]?i=f[1090]:(f[1091]=-1,f[1092]=-1,f[1089]=4096,f[1090]=4096,f[1088]=e+12&-16^1431655768,f[1093]=0,f[1081]=0,i=4096),(i=(k=b+i|0)&(u=0-i|0))>>>0<=c>>>0)break A;if((n=f[1080])&&(o=(r=f[1078])+i|0)>>>0>n>>>0|r>>>0>=o>>>0)break A;if(4&a[4324])break f;c:{b:{if(n=f[976])for(A=4328;;){if((r=f[A>>2])>>>0<=n>>>0&n>>>0<r+f[A+4>>2]>>>0)break b;if(!(A=f[A+8>>2]))break}if(-1==(0|(r=I(0))))break a;if(o=i,(A=(n=f[1089])-1|0)&r&&(o=(i-r|0)+(A+r&0-n)|0),o>>>0<=c>>>0|o>>>0>2147483646)break a;if((n=f[1080])&&n>>>0<(u=(A=f[1078])+o|0)>>>0|A>>>0>=u>>>0)break a;if((0|r)!=(0|(A=I(o))))break c;break n}if((o=u&k-s)>>>0>2147483646)break a;if((0|(r=I(o)))==(f[A>>2]+f[A+4>>2]|0))break t;A=r}if(!(-1==(0|A)|c+48>>>0<=o>>>0)){if((r=(r=f[1090])+(b-o|0)&0-r)>>>0>2147483646){r=A;break n}if(-1!=(0|I(r))){o=r+o|0,r=A;break n}I(0-o|0);break a}if(r=A,-1!=(0|A))break n;break a}u=0;break e}r=0;break r}if(-1!=(0|r))break n}f[1081]=4|f[1081]}if(i>>>0>2147483646)break i;if(-1==(0|(r=I(i)))|-1==(0|(A=I(0)))|A>>>0<=r>>>0)break i;if((o=A-r|0)>>>0<=c+40>>>0)break i}A=f[1078]+o|0,f[1078]=A,A>>>0>t[1079]&&(f[1079]=A);n:{f:{a:{if(b=f[976]){for(A=4328;;){if(((n=f[A>>2])+(i=f[A+4>>2])|0)==(0|r))break a;if(!(A=f[A+8>>2]))break}break f}for((A=f[974])>>>0<=r>>>0&&A||(f[974]=r),A=0,f[1083]=o,f[1082]=r,f[978]=-1,f[979]=f[1088],f[1085]=0;i=(n=A<<3)+3920|0,f[n+3928>>2]=i,f[n+3932>>2]=i,32!=(0|(A=A+1|0)););i=(n=o-40|0)-(A=r+8&7?-8-r&7:0)|0,f[973]=i,A=A+r|0,f[976]=A,f[A+4>>2]=1|i,f[4+(r+n|0)>>2]=40,f[977]=f[1092];break n}if(!(8&a[A+12|0]|n>>>0>b>>>0|r>>>0<=b>>>0)){f[A+4>>2]=i+o,i=(A=b+8&7?-8-b&7:0)+b|0,f[976]=i,A=(r=f[973]+o|0)-A|0,f[973]=A,f[i+4>>2]=1|A,f[4+(r+b|0)>>2]=40,f[977]=f[1092];break n}}t[974]>r>>>0&&(f[974]=r),i=r+o|0,A=4328;f:{a:{t:{o:{u:{c:{for(;;){if((0|i)!=f[A>>2]){if(A=f[A+8>>2])continue;break c}break}if(!(8&a[A+12|0]))break u}for(A=4328;;){if((i=f[A>>2])>>>0<=b>>>0&&(u=i+f[A+4>>2]|0)>>>0>b>>>0)break o;A=f[A+8>>2]}}if(f[A>>2]=r,f[A+4>>2]=f[A+4>>2]+o,f[(k=(r+8&7?-8-r&7:0)+r|0)+4>>2]=3|c,c=(o=i+(i+8&7?-8-i&7:0)|0)-(s=c+k|0)|0,(0|o)==(0|b)){f[976]=s,A=f[973]+c|0,f[973]=A,f[s+4>>2]=1|A;break a}if(f[975]==(0|o)){f[975]=s,A=f[972]+c|0,f[972]=A,f[s+4>>2]=1|A,f[A+s>>2]=A;break a}if(1==(3&(A=f[o+4>>2]))){u=-8&A;u:if(A>>>0<=255){if(i=f[o+8>>2],A=A>>>3|0,(0|(r=f[o+12>>2]))==(0|i)){f[970]=f[970]&E(A);break u}f[i+12>>2]=r,f[r+8>>2]=i}else{if(b=f[o+24>>2],(0|o)==(0|(r=f[o+12>>2])))if((n=f[(A=o+20|0)>>2])||(n=f[(A=o+16|0)>>2])){for(;i=A,(n=f[(A=(r=n)+20|0)>>2])||(A=r+16|0,n=f[r+16>>2]););f[i>>2]=0}else r=0;else A=f[o+8>>2],f[A+12>>2]=r,f[r+8>>2]=A;if(b){i=f[o+28>>2];c:{if(f[(A=4184+(i<<2)|0)>>2]==(0|o)){if(f[A>>2]=r,r)break c;f[971]=f[971]&E(i);break u}if(f[b+(f[b+16>>2]==(0|o)?16:20)>>2]=r,!r)break u}f[r+24>>2]=b,(A=f[o+16>>2])&&(f[r+16>>2]=A,f[A+24>>2]=r),(A=f[o+20>>2])&&(f[r+20>>2]=A,f[A+24>>2]=r)}}c=u+c|0,o=o+u|0}if(f[o+4>>2]=-2&f[o+4>>2],f[s+4>>2]=1|c,f[c+s>>2]=c,c>>>0<=255){r=3920+((A=c>>>3|0)<<3)|0,(i=f[970])&(A=1<<A)?A=f[r+8>>2]:(f[970]=A|i,A=r),f[r+8>>2]=s,f[A+12>>2]=s,f[s+12>>2]=r,f[s+8>>2]=A;break a}if(A=31,c>>>0<=16777215&&(A=c>>>8|0,A<<=n=A+1048320>>>16&8,A=28+((A=((A<<=i=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|i|n)|0)<<1|c>>>A+21&1)|0),f[s+28>>2]=A,f[s+16>>2]=0,f[s+20>>2]=0,n=4184+(A<<2)|0,(i=f[971])&(r=1<<A)){for(A=c<<(31==(0|A)?0:25-(A>>>1|0)|0),r=f[n>>2];;){if(i=r,(-8&f[r+4>>2])==(0|c))break t;if(r=A>>>29|0,A<<=1,!(r=f[(n=i+(4&r)|0)+16>>2]))break}f[n+16>>2]=s,f[s+24>>2]=i}else f[971]=r|i,f[n>>2]=s,f[s+24>>2]=n;f[s+12>>2]=s,f[s+8>>2]=s;break a}for(i=(n=o-40|0)-(A=r+8&7?-8-r&7:0)|0,f[973]=i,A=A+r|0,f[976]=A,f[A+4>>2]=1|i,f[4+(r+n|0)>>2]=40,f[977]=f[1092],f[(i=(A=(u+(u-39&7?39-u&7:0)|0)-47|0)>>>0<b+16>>>0?b:A)+4>>2]=27,A=f[1085],f[i+16>>2]=f[1084],f[i+20>>2]=A,A=f[1083],f[i+8>>2]=f[1082],f[i+12>>2]=A,f[1084]=i+8,f[1083]=o,f[1082]=r,f[1085]=0,A=i+24|0;f[A+4>>2]=7,r=A+8|0,A=A+4|0,r>>>0<u>>>0;);if((0|i)==(0|b))break n;if(f[i+4>>2]=-2&f[i+4>>2],u=i-b|0,f[b+4>>2]=1|u,f[i>>2]=u,u>>>0<=255){r=3920+((A=u>>>3|0)<<3)|0,(i=f[970])&(A=1<<A)?A=f[r+8>>2]:(f[970]=A|i,A=r),f[r+8>>2]=b,f[A+12>>2]=b,f[b+12>>2]=r,f[b+8>>2]=A;break n}if(A=31,f[b+16>>2]=0,f[b+20>>2]=0,u>>>0<=16777215&&(A=u>>>8|0,A<<=n=A+1048320>>>16&8,A=28+((A=((A<<=i=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|i|n)|0)<<1|u>>>A+21&1)|0),f[b+28>>2]=A,n=4184+(A<<2)|0,(i=f[971])&(r=1<<A)){for(A=u<<(31==(0|A)?0:25-(A>>>1|0)|0),r=f[n>>2];;){if(i=r,(0|u)==(-8&f[r+4>>2]))break f;if(r=A>>>29|0,A<<=1,!(r=f[(n=i+(4&r)|0)+16>>2]))break}f[n+16>>2]=b,f[b+24>>2]=i}else f[971]=r|i,f[n>>2]=b,f[b+24>>2]=n;f[b+12>>2]=b,f[b+8>>2]=b;break n}A=f[i+8>>2],f[A+12>>2]=s,f[i+8>>2]=s,f[s+24>>2]=0,f[s+12>>2]=i,f[s+8>>2]=A}A=k+8|0;break A}A=f[i+8>>2],f[A+12>>2]=b,f[i+8>>2]=b,f[b+24>>2]=0,f[b+12>>2]=i,f[b+8>>2]=A}if(!((A=f[973])>>>0<=c>>>0)){r=A-c|0,f[973]=r,A=(i=f[976])+c|0,f[976]=A,f[A+4>>2]=1|r,f[i+4>>2]=3|c,A=i+8|0;break A}}f[969]=48,A=0;break A}r:if(o){i=f[u+28>>2];i:{if(f[(A=4184+(i<<2)|0)>>2]==(0|u)){if(f[A>>2]=r,r)break i;s=E(i)&s,f[971]=s;break r}if(f[o+(f[o+16>>2]==(0|u)?16:20)>>2]=r,!r)break r}f[r+24>>2]=o,(A=f[u+16>>2])&&(f[r+16>>2]=A,f[A+24>>2]=r),(A=f[u+20>>2])&&(f[r+20>>2]=A,f[A+24>>2]=r)}r:if(n>>>0<=15)A=n+c|0,f[u+4>>2]=3|A,f[(A=A+u|0)+4>>2]=1|f[A+4>>2];else if(f[u+4>>2]=3|c,f[(o=u+c|0)+4>>2]=1|n,f[o+n>>2]=n,n>>>0<=255)r=3920+((A=n>>>3|0)<<3)|0,(i=f[970])&(A=1<<A)?A=f[r+8>>2]:(f[970]=A|i,A=r),f[r+8>>2]=o,f[A+12>>2]=o,f[o+12>>2]=r,f[o+8>>2]=A;else{A=31,n>>>0<=16777215&&(A=n>>>8|0,A<<=k=A+1048320>>>16&8,A=28+((A=((A<<=i=A+520192>>>16&4)<<(r=A+245760>>>16&2)>>>15|0)-(r|i|k)|0)<<1|n>>>A+21&1)|0),f[o+28>>2]=A,f[o+16>>2]=0,f[o+20>>2]=0,r=4184+(A<<2)|0;i:{if((i=1<<A)&s){for(A=n<<(31==(0|A)?0:25-(A>>>1|0)|0),i=f[r>>2];;){if((-8&f[(r=i)+4>>2])==(0|n))break i;if(i=A>>>29|0,A<<=1,!(i=f[(k=(4&i)+r|0)+16>>2]))break}f[k+16>>2]=o}else f[971]=i|s,f[r>>2]=o;f[o+24>>2]=r,f[o+12>>2]=o,f[o+8>>2]=o;break r}A=f[r+8>>2],f[A+12>>2]=o,f[r+8>>2]=o,f[o+24>>2]=0,f[o+12>>2]=r,f[o+8>>2]=A}A=u+8|0;break A}e:if(s){i=f[r+28>>2];r:{if(f[(A=4184+(i<<2)|0)>>2]==(0|r)){if(f[A>>2]=u,u)break r;f[971]=E(i)&b;break e}if(f[s+(f[s+16>>2]==(0|r)?16:20)>>2]=u,!u)break e}f[u+24>>2]=s,(A=f[r+16>>2])&&(f[u+16>>2]=A,f[A+24>>2]=u),(A=f[r+20>>2])&&(f[u+20>>2]=A,f[A+24>>2]=u)}n>>>0<=15?(A=n+c|0,f[r+4>>2]=3|A,f[(A=A+r|0)+4>>2]=1|f[A+4>>2]):(f[r+4>>2]=3|c,f[(u=r+c|0)+4>>2]=1|n,f[n+u>>2]=n,l&&(i=3920+((A=l>>>3|0)<<3)|0,k=f[975],(A=1<<A)&o?A=f[i+8>>2]:(f[970]=A|o,A=i),f[i+8>>2]=k,f[A+12>>2]=k,f[k+12>>2]=i,f[k+8>>2]=A),f[975]=u,f[972]=n),A=r+8|0}return p=e+16|0,0|A}function B(A){var e,r=0,i=0,n=0,a=0,t=0,g=0,d=0,h=0,m=0,B=0,C=0,D=0,I=0,M=0,E=0,U=0,Y=0,F=0,J=0,P=0,K=0,O=0,N=0,R=0,x=0;p=e=p-16|0,b(+A),r=0|o(1),o(0);A:if((r&=2147483647)>>>0<=1072243195){if(n=1,r>>>0<1044816030)break A;n=v(A,0)}else if(n=A-A,!(r>>>0>=2146435072)){p=D=p-48|0,b(+A),C=0|o(1),r=0|o(0);e:{r:{h=C;i:{if((t=2147483647&C)>>>0<=1074752122){if(598523==(1048575&h))break i;if(t>>>0<=1073928572){if((0|C)>0|(0|C)>=0){n=(A+=-1.5707963267341256)+-6077100506506192e-26,s[e>>3]=n,s[e+8>>3]=A-n-6077100506506192e-26,i=1;break e}n=(A+=1.5707963267341256)+6077100506506192e-26,s[e>>3]=n,s[e+8>>3]=A-n+6077100506506192e-26,i=-1;break e}if((0|C)>0|(0|C)>=0){n=(A+=-3.1415926534682512)+-1.2154201013012384e-10,s[e>>3]=n,s[e+8>>3]=A-n-1.2154201013012384e-10,i=2;break e}n=(A+=3.1415926534682512)+1.2154201013012384e-10,s[e>>3]=n,s[e+8>>3]=A-n+1.2154201013012384e-10,i=-2;break e}if(t>>>0<=1075594811){if(t>>>0<=1075183036){if(1074977148==(0|t))break i;if((0|C)>0|(0|C)>=0){n=(A+=-4.712388980202377)+-1.8231301519518578e-10,s[e>>3]=n,s[e+8>>3]=A-n-1.8231301519518578e-10,i=3;break e}n=(A+=4.712388980202377)+1.8231301519518578e-10,s[e>>3]=n,s[e+8>>3]=A-n+1.8231301519518578e-10,i=-3;break e}if(1075388923==(0|t))break i;if((0|C)>0|(0|C)>=0){n=(A+=-6.2831853069365025)+-2.430840202602477e-10,s[e>>3]=n,s[e+8>>3]=A-n-2.430840202602477e-10,i=4;break e}n=(A+=6.2831853069365025)+2.430840202602477e-10,s[e>>3]=n,s[e+8>>3]=A-n+2.430840202602477e-10,i=-4;break e}if(t>>>0>1094263290)break r}r=(P=(n=A+-1.5707963267341256*(m=.6366197723675814*A+6755399441055744-6755399441055744))-(B=6077100506506192e-26*m))<-.7853981633974483,i=l(m)<2147483648?~~m:-2147483648,r?(i=i-1|0,B=6077100506506192e-26*(m+=-1),n=A+-1.5707963267341256*m):P>.7853981633974483&&(i=i+1|0,B=6077100506506192e-26*(m+=1),n=A+-1.5707963267341256*m),A=n-B,s[e>>3]=A,b(+A),a=0|o(1),o(0),((r=t>>>20|0)-(a>>>20&2047)|0)<17||(B=n,A=(n-=A=6077100506303966e-26*m)-(B=20222662487959506e-37*m-(B-n-A)),s[e>>3]=A,a=r,b(+A),r=0|o(1),o(0),(a-(r>>>20&2047)|0)<50||(B=n,A=(n-=A=20222662487111665e-37*m)-(B=84784276603689e-45*m-(B-n-A)),s[e>>3]=A)),s[e+8>>3]=n-A-B;break e}if(t>>>0>=2146435072)A-=A,s[e>>3]=A,s[e+8>>3]=A;else{for(u(0,0|r),u(1,1048575&C|1096810496),A=+c(),r=1;h=(D+16|0)+(i<<3)|0,n=+(0|(i=l(A)<2147483648?~~A:-2147483648)),s[h>>3]=n,A=16777216*(A-n),i=1,h=1&r,r=0,h;);if(s[D+32>>3]=A,0==A)for(r=1;i=r,r=r-1|0,0==s[(D+16|0)+(i<<3)>>3];);else i=2;if(K=D+16|0,p=g=p-560|0,t=k(J=(0|(t=((r=(t>>>20|0)-1046|0)-3|0)/24|0))>0?t:0,-24)+r|0,((M=f[257])+(d=(U=i+1|0)-1|0)|0)>=0)for(i=M+U|0,r=J-d|0;s[(g+320|0)+(a<<3)>>3]=(0|r)<0?0:+f[1040+(r<<2)>>2],r=r+1|0,(0|i)!=(0|(a=a+1|0)););for(h=t-24|0,i=0,a=(0|M)>0?M:0,I=(0|U)<=0;;){if(I)A=0;else for(Y=i+d|0,r=0,A=0;A=s[(r<<3)+K>>3]*s[(g+320|0)+(Y-r<<3)>>3]+A,(0|U)!=(0|(r=r+1|0)););if(s[(i<<3)+g>>3]=A,r=(0|i)==(0|a),i=i+1|0,r)break}R=47-t|0,Y=48-t|0,x=t-25|0,i=M;r:{for(;;){if(A=s[(i<<3)+g>>3],r=0,a=i,!(E=(0|i)<=0))for(;I=(g+480|0)+(r<<2)|0,d=l(n=5.960464477539063e-8*A)<2147483648?~~n:-2147483648,d=l(A=-16777216*(n=+(0|d))+A)<2147483648?~~A:-2147483648,f[I>>2]=d,A=s[((a=a-1|0)<<3)+g>>3]+n,(0|i)!=(0|(r=r+1|0)););A=Q(A,h),A+=-8*w(.125*A),A-=+(0|(I=l(A)<2147483648?~~A:-2147483648));i:{n:{f:{if(O=(0|h)<=0){if(h)break f;d=f[476+((i<<2)+g|0)>>2]>>23}else F=a=(i<<2)+g|0,a=(d=f[a+476>>2])-((r=d>>Y)<<Y)|0,f[F+476>>2]=a,I=r+I|0,d=a>>R;if((0|d)<=0)break i;break n}if(d=2,!(A>=.5)){d=0;break i}}if(r=0,a=0,!E)for(;E=f[(F=(g+480|0)+(r<<2)|0)>>2],N=16777215,a||(N=16777216,E)?(f[F>>2]=N-E,a=1):a=0,(0|i)!=(0|(r=r+1|0)););n:if(!O){r=8388607;f:switch(0|x){case 1:r=4194303;break;case 0:break f;default:break n}f[(E=(i<<2)+g|0)+476>>2]=f[E+476>>2]&r}I=I+1|0,2==(0|d)&&(A=1-A,d=2,a&&(A-=Q(1,h)))}if(0!=A)break;if(a=0,!((0|M)>=(0|(r=i)))){for(;a=f[(g+480|0)+((r=r-1|0)<<2)>>2]|a,(0|r)>(0|M););if(a){for(t=h;t=t-24|0,!f[(g+480|0)+((i=i-1|0)<<2)>>2];);break r}}for(r=1;a=r,r=r+1|0,!f[(g+480|0)+(M-a<<2)>>2];);for(a=i+a|0;;){if(d=i+U|0,i=i+1|0,s[(g+320|0)+(d<<3)>>3]=f[1040+(J+i<<2)>>2],r=0,A=0,(0|U)>0)for(;A=s[(r<<3)+K>>3]*s[(g+320|0)+(d-r<<3)>>3]+A,(0|U)!=(0|(r=r+1|0)););if(s[(i<<3)+g>>3]=A,!((0|i)<(0|a)))break}i=a}(A=Q(A,24-t|0))>=16777216?(h=(g+480|0)+(i<<2)|0,r=l(n=5.960464477539063e-8*A)<2147483648?~~n:-2147483648,a=l(A=-16777216*+(0|r)+A)<2147483648?~~A:-2147483648,f[h>>2]=a,i=i+1|0):(r=l(A)<2147483648?~~A:-2147483648,t=h),f[(g+480|0)+(i<<2)>>2]=r}if(A=Q(1,t),!((0|i)<0)){for(r=i;a=r,s[(r<<3)+g>>3]=A*+f[(g+480|0)+(r<<2)>>2],r=r-1|0,A*=5.960464477539063e-8,a;);if(!((0|i)<0))for(r=i;;){for(a=r,t=i-r|0,A=0,r=0;A=s[3808+(r<<3)>>3]*s[(r+a<<3)+g>>3]+A,!((0|r)>=(0|M))&&(h=r>>>0<t>>>0,r=r+1|0,h););if(s[(g+160|0)+(t<<3)>>3]=A,r=a-1|0,!((0|a)>0))break}}if(A=0,(0|i)>=0)for(r=i;a=r,r=r-1|0,A+=s[(g+160|0)+(a<<3)>>3],a;);if(s[D>>3]=d?-A:A,A=s[g+160>>3]-A,r=1,(0|i)>0)for(;A+=s[(g+160|0)+(r<<3)>>3],a=(0|r)!=(0|i),r=r+1|0,a;);s[D+8>>3]=d?-A:A,p=g+560|0,i=7&I,A=s[D>>3],(0|C)<0?(s[e>>3]=-A,s[e+8>>3]=-s[D+8>>3],i=0-i|0):(s[e>>3]=A,s[e+8>>3]=s[D+8>>3])}}p=D+48|0;e:switch(3&i){case 0:n=v(s[e>>3],s[e+8>>3]);break A;case 1:n=-y(s[e>>3],s[e+8>>3]);break A;case 2:n=-v(s[e>>3],s[e+8>>3]);break A;default:break e}n=y(s[e>>3],s[e+8>>3])}return p=e+16|0,n}function C(A){var e=0,r=0,i=0,n=0,a=0,o=0,u=0;A:if(A|=0){a=(i=A-8|0)+(A=-8&(e=f[A-4>>2]))|0;e:if(!(1&e)){if(!(3&e))break A;if((i=i-(e=f[i>>2])|0)>>>0<t[974])break A;if(A=A+e|0,f[975]==(0|i)){if(3==(3&(e=f[a+4>>2])))return f[972]=A,f[a+4>>2]=-2&e,f[i+4>>2]=1|A,void(f[A+i>>2]=A)}else{if(e>>>0<=255){if(n=f[i+8>>2],e=e>>>3|0,(0|(r=f[i+12>>2]))==(0|n)){f[970]=f[970]&E(e);break e}f[n+12>>2]=r,f[r+8>>2]=n;break e}if(u=f[i+24>>2],(0|i)==(0|(e=f[i+12>>2])))if((r=f[(n=i+20|0)>>2])||(r=f[(n=i+16|0)>>2])){for(;o=n,(r=f[(n=(e=r)+20|0)>>2])||(n=e+16|0,r=f[e+16>>2]););f[o>>2]=0}else e=0;else r=f[i+8>>2],f[r+12>>2]=e,f[e+8>>2]=r;if(!u)break e;n=f[i+28>>2];r:{if(f[(r=4184+(n<<2)|0)>>2]==(0|i)){if(f[r>>2]=e,e)break r;f[971]=f[971]&E(n);break e}if(f[u+(f[u+16>>2]==(0|i)?16:20)>>2]=e,!e)break e}if(f[e+24>>2]=u,(r=f[i+16>>2])&&(f[e+16>>2]=r,f[r+24>>2]=e),!(r=f[i+20>>2]))break e;f[e+20>>2]=r,f[r+24>>2]=e}}if(!(i>>>0>=a>>>0)&&1&(e=f[a+4>>2])){e:{if(!(2&e)){if(f[976]==(0|a)){if(f[976]=i,A=f[973]+A|0,f[973]=A,f[i+4>>2]=1|A,f[975]!=(0|i))break A;return f[972]=0,void(f[975]=0)}if(f[975]==(0|a))return f[975]=i,A=f[972]+A|0,f[972]=A,f[i+4>>2]=1|A,void(f[A+i>>2]=A);A=(-8&e)+A|0;r:if(e>>>0<=255){if(n=f[a+8>>2],e=e>>>3|0,(0|(r=f[a+12>>2]))==(0|n)){f[970]=f[970]&E(e);break r}f[n+12>>2]=r,f[r+8>>2]=n}else{if(u=f[a+24>>2],(0|a)==(0|(e=f[a+12>>2])))if((r=f[(n=a+20|0)>>2])||(r=f[(n=a+16|0)>>2])){for(;o=n,(r=f[(n=(e=r)+20|0)>>2])||(n=e+16|0,r=f[e+16>>2]););f[o>>2]=0}else e=0;else r=f[a+8>>2],f[r+12>>2]=e,f[e+8>>2]=r;if(u){n=f[a+28>>2];i:{if(f[(r=4184+(n<<2)|0)>>2]==(0|a)){if(f[r>>2]=e,e)break i;f[971]=f[971]&E(n);break r}if(f[u+(f[u+16>>2]==(0|a)?16:20)>>2]=e,!e)break r}f[e+24>>2]=u,(r=f[a+16>>2])&&(f[e+16>>2]=r,f[r+24>>2]=e),(r=f[a+20>>2])&&(f[e+20>>2]=r,f[r+24>>2]=e)}}if(f[i+4>>2]=1|A,f[A+i>>2]=A,f[975]!=(0|i))break e;return void(f[972]=A)}f[a+4>>2]=-2&e,f[i+4>>2]=1|A,f[A+i>>2]=A}if(A>>>0<=255)return e=3920+((A=A>>>3|0)<<3)|0,(r=f[970])&(A=1<<A)?A=f[e+8>>2]:(f[970]=A|r,A=e),f[e+8>>2]=i,f[A+12>>2]=i,f[i+12>>2]=e,void(f[i+8>>2]=A);n=31,f[i+16>>2]=0,f[i+20>>2]=0,A>>>0<=16777215&&(e=A>>>8|0,e<<=o=e+1048320>>>16&8,n=28+((e=((e<<=n=e+520192>>>16&4)<<(r=e+245760>>>16&2)>>>15|0)-(r|n|o)|0)<<1|A>>>e+21&1)|0),f[i+28>>2]=n,o=4184+(n<<2)|0;e:{r:{if((r=f[971])&(e=1<<n)){for(n=A<<(31==(0|n)?0:25-(n>>>1|0)|0),e=f[o>>2];;){if(r=e,(-8&f[e+4>>2])==(0|A))break r;if(e=n>>>29|0,n<<=1,!(e=f[(o=r+(4&e)|0)+16>>2]))break}f[o+16>>2]=i,f[i+24>>2]=r}else f[971]=e|r,f[o>>2]=i,f[i+24>>2]=o;f[i+12>>2]=i,f[i+8>>2]=i;break e}A=f[r+8>>2],f[A+12>>2]=i,f[r+8>>2]=i,f[i+24>>2]=0,f[i+12>>2]=r,f[i+8>>2]=A}A=f[978]-1|0,f[978]=A||-1}}}function D(A,e){var r=0,n=0,f=0,a=0;if(e){if(n=7&e,e-1>>>0>=7)for(a=-8&e,e=0;i[A+r|0]=0,i[(1|r)+A|0]=0,i[(2|r)+A|0]=0,i[(3|r)+A|0]=0,i[(4|r)+A|0]=0,i[(5|r)+A|0]=0,i[(6|r)+A|0]=0,i[(7|r)+A|0]=0,r=r+8|0,(0|a)!=(0|(e=e+8|0)););if(n)for(;i[A+r|0]=0,r=r+1|0,(0|(f=f+1|0))!=(0|n););}return A}function Q(A,e){A:if((0|e)>=1024){if(A*=898846567431158e293,e>>>0<2047){e=e-1023|0;break A}A*=898846567431158e293,e=((0|e)<3069?e:3069)-2046|0}else(0|e)>-1023||(A*=2004168360008973e-307,e>>>0>4294965304?e=e+969|0:(A*=2004168360008973e-307,e=((0|e)>-2960?e:-2960)+1938|0));return u(0,0),u(1,e+1023<<20),A*+c()}function v(A,e){var r,i,n=0;return(i=1-(n=.5*(r=A*A)))+(1-i-n+(r*(r*(r*(2480158728947673e-20*r-.001388888888887411)+.0416666666666666)+(n=r*r)*n*(r*(-11359647557788195e-27*r+2.087572321298175e-9)-2.7557314351390663e-7))-A*e))}function y(A,e){var r,i;return A-((r=A*A)*(.5*e-(r*(r*r)*(1.58969099521155e-10*r-2.5050760253406863e-8)+(r*(27557313707070068e-22*r-.0001984126982985795)+.00833333333332249))*(i=r*A))-e+.16666666666666632*i)}function I(A){var e,i;return(A=(e=f[968])+(i=A+3&-4)|0)>>>0<=e>>>0&&i||A>>>0>(r.byteLength/65536|0)<<16>>>0&&!(0|d(0|A))?(f[969]=48,-1):(f[968]=A,e)}function M(A){var e=0;A=A||1;A:{for(;;){if(e=m(A))break A;if(!(e=f[1094]))break;Y[0|e]()}h(),g()}return e}function E(A){var e;return(-1>>>(e=31&A)&-2)<<e|(-1<<(A=0-A&31)&-2)>>>A}n(e=a,1024,"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"),n(e,3811,"QPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNQ=="),n(e,3872,"IBFQ");var U,Y=((U=[]).set=function(A,e){this[A]=e},U.get=function(A){return this[A]},U);return{d:function(){},e:function(A){A|=0;var e,r,i,n,a,t,o=0,u=0,c=0,b=0,k=0,l=0,w=0,g=0,d=0,h=0,p=0,m=0;if(r=M(20),i=M((536870911&(e=A))!=(0|e)?-1:e<<3),e){if(g=+(e>>>0),1!=(0|e))for(A=-2&e;s[(o<<3)+i>>3]=B(6.283185307179586*+(o>>>0)/g),s[((b=1|o)<<3)+i>>3]=B(6.283185307179586*+(b>>>0)/g),o=o+2|0,(0|A)!=(0|(c=c+2|0)););1&e&&(s[(o<<3)+i>>3]=B(6.283185307179586*+(o>>>0)/g))}if(a=M(n=-4&e),!(t=e>>>0<4)&&(c=1,d=D(a,((b=e>>>2|0)>>>0>1?b:1)<<2),!(e>>>0<8)))for(A=b;;){for(h=A-(w=A>>>1|0)&3,m=(-1^w)+A|0,k=0,l=A;;){if(!((o=k+w|0)>>>0>=(k=A+k|0)>>>0)){if(u=0,h)for(;f[(p=(o<<2)+d|0)>>2]=f[p>>2]+c,o=o+1|0,(0|h)!=(0|(u=u+1|0)););if(!(m>>>0<3))for(;f[(u=(o<<2)+d|0)>>2]=f[u>>2]+c,f[u+4>>2]=f[u+4>>2]+c,f[u+8>>2]=f[u+8>>2]+c,f[u+12>>2]=f[u+12>>2]+c,(0|l)!=(0|(o=o+4|0)););}if(l=A+l|0,!(b>>>0>k>>>0))break}if(c<<=1,l=A>>>0>3,A=w,!l)break}return f[r+12>>2]=0,f[r+8>>2]=a,f[r+4>>2]=i,f[r>>2]=e,A=M(n),t||D(A,-4&e),f[r+16>>2]=A,0|r},f:function(A,e,r,i){e|=0,r|=0;var n=0,a=0,t=0,o=0,u=0,c=0,b=0,l=0,w=0,g=0,d=0,h=0,p=0,m=0,B=0,C=0,D=0,Q=0,v=0,y=0,I=0,M=0,E=0,U=0,Y=0,F=0,J=0,P=0,K=0,O=0,N=0,R=0,x=0,H=0,G=0;A:{Q=i|=0;e:{r:{i:{n:{f:switch((h=f[(A|=0)>>2])-1|0){case 1:break n;case 0:break f;default:break i}A=f[e+4>>2],f[r>>2]=f[e>>2],f[r+4>>2]=A,A=f[e+12>>2],f[r+8>>2]=f[e+8>>2],f[r+12>>2]=A;break A}u=s[e+24>>3],c=s[e+8>>3],t=s[e>>3],b=s[e+16>>3],s[r+16>>3]=t-b;break r}if(a=f[A+16>>2],I=f[A+4>>2],f[A+12>>2]!=(0|e)&&(i=f[A+8>>2],f[A+12>>2]=e,!(h>>>0<4))){if(p=3&(n=h>>>2|0),A=0,n-1>>>0>=3)for(v=1073741820&n;f[(n=A<<2)+a>>2]=(f[i+n>>2]<<4)+e,f[(M=4|n)+a>>2]=(f[i+M>>2]<<4)+e,f[(M=8|n)+a>>2]=(f[i+M>>2]<<4)+e,f[(n|=12)+a>>2]=(f[i+n>>2]<<4)+e,A=A+4|0,(0|v)!=(0|(o=o+4|0)););if(p)for(;f[(o=A<<2)+a>>2]=(f[i+o>>2]<<4)+e,A=A+1|0,(0|p)!=(0|(m=m+1|0)););}i:{if((0|Q)>0){n:switch(h-1|0){case 1:break i;case 0:break e;default:break n}if(e=h>>>2|0,(p=(-4&h)+a|0)>>>0>a>>>0)for(A=e<<4,i=r;o=f[a>>2],u=s[(m=(n=o+A|0)+A|0)>>3],c=s[n+8>>3],t=s[(v=A+m|0)+8>>3],b=s[o>>3],w=(l=s[o+8>>3])-(B=s[m+8>>3]),D=(g=s[n>>3])-(C=s[v>>3]),s[i+56>>3]=w+D,y=b-u,d=c-t,s[i+48>>3]=y-d,l+=B,c+=t,s[i+40>>3]=l-c,u=b+u,t=g+C,s[i+32>>3]=u-t,s[i+24>>3]=w-D,s[i+16>>3]=y+d,s[i+8>>3]=l+c,s[i>>3]=u+t,i=i- -64|0,p>>>0>(a=a+4|0)>>>0;);if(v=e<<3,p=(P=h<<3)-8|0,Q=0-(k(Q,h>>>3|0)<<3)|0,A=8,h>>>0>=9)for(M=(h<<4)+r|0;;){if(a=A<<3,M>>>0>(i=r)>>>0)for(;u=s[(e=i+a|0)>>3],c=s[(o=e+a|0)>>3],t=s[(n=a+o|0)>>3],B=(b=s[i+8>>3])+(l=s[e+8>>3]),C=(w=s[o+8>>3])+(g=s[n+8>>3]),s[i+8>>3]=B+C,y=u+(D=s[i>>3]),d=c+t,s[i>>3]=y+d,b-=l,c-=t,s[e+8>>3]=b-c,u=D-u,t=w-g,s[e>>3]=u+t,s[o+8>>3]=B-C,s[o>>3]=y-d,s[n+8>>3]=b+c,s[n>>3]=u-t,M>>>0>(i=a+n|0)>>>0;);if(n=16,m=O=(e=Q)+(o=K=e>>1)|0,(0|a)>=17)for(;;){if(M>>>0>(i=r+n|0)>>>0)for(u=s[(p&m)+I>>3],c=s[(e&p)+I>>3],t=s[(o&p)+I>>3],b=s[(p&v-m)+I>>3],l=s[(p&v-e)+I>>3],B=s[(p&v-o)+I>>3];y=(w=s[i+8>>3])+(D=(g=s[(E=i+a|0)>>3])*l+c*(C=s[E+8>>3])),H=(N=(d=s[(U=a+E|0)>>3])*B+t*(Y=s[U+8>>3]))+(x=(J=s[(F=a+U|0)>>3])*b+u*(R=s[F+8>>3])),s[i+8>>3]=y+H,C=(G=s[i>>3])+(g=g*c-l*C),J=(d=d*t-B*Y)+(Y=J*u-b*R),s[i>>3]=C+J,w-=D,D=d-Y,s[E+8>>3]=w-D,g=G-g,d=N-x,s[E>>3]=g+d,s[U+8>>3]=y-H,s[U>>3]=C-J,s[F+8>>3]=w+D,s[F>>3]=g-d,M>>>0>(i=a+F|0)>>>0;);if(m=m+O|0,e=e+Q|0,o=o+K|0,!((0|a)>(0|(n=n+16|0))))break}if(Q>>=2,!(h>>>0>(A<<=2)>>>0))break}if((0|A)!=(0|h))break A;if(u=s[(o=r+P|0)>>3],c=s[r+8>>3],t=s[o+8>>3],s[r+8>>3]=c+t,b=s[r>>3],s[r>>3]=u+b,s[o+8>>3]=c-t,s[o>>3]=b-u,u=s[(A=P+(n=(m=h<<2)+r|0)|0)+8>>3],c=s[n+8>>3],t=s[A>>3],s[n+8>>3]=c-t,b=s[n>>3],s[n>>3]=u+b,s[A+8>>3]=c+t,s[A>>3]=b-u,n>>>0>o>>>0)break A;for(i=0,A=o;;){if(i=i+Q|0,e=A+16|0,(a=r+16|0)>>>0<n>>>0)for(;u=s[r+24>>3],h=e,c=s[a>>3],w=(t=s[e>>3])*(b=s[(i&p)+I>>3])-(l=s[(p&v-i)+I>>3])*(B=s[A+24>>3]),s[a>>3]=c+w,t=t*l+b*B,s[r+24>>3]=u+t,s[e>>3]=c-w,s[A+24>>3]=u-t,i=i+Q|0,e=e+16|0,A=h,r=a,(a=a+16|0)>>>0<n>>>0;);if(r=a,A=e,!(o>>>0>=(n=n+m|0)>>>0))break}break A}n:switch(h-1|0){case 1:break i;case 0:break e;default:break n}if(e=h>>>2|0,(p=(-4&h)+a|0)>>>0>a>>>0)for(A=e<<4,i=r;o=f[a>>2],u=s[(m=(n=o+A|0)+A|0)>>3],c=s[n+8>>3],t=s[(v=A+m|0)+8>>3],b=s[o>>3],w=(l=s[o+8>>3])-(B=s[m+8>>3]),D=(g=s[n>>3])-(C=s[v>>3]),s[i+56>>3]=w-D,y=b-u,d=c-t,s[i+48>>3]=y+d,l+=B,c+=t,s[i+40>>3]=l-c,u=b+u,t=g+C,s[i+32>>3]=u-t,s[i+24>>3]=w+D,s[i+16>>3]=y-d,s[i+8>>3]=l+c,s[i>>3]=u+t,i=i- -64|0,p>>>0>(a=a+4|0)>>>0;);if(v=e<<3,p=(P=h<<3)-8|0,Q=0-(k(Q,h>>>3|0)<<3)|0,A=8,h>>>0>=9)for(M=(h<<4)+r|0;;){if(a=A<<3,M>>>0>(i=r)>>>0)for(;u=s[(e=i+a|0)>>3],c=s[(o=e+a|0)>>3],t=s[(n=a+o|0)>>3],B=(b=s[i+8>>3])+(l=s[e+8>>3]),C=(w=s[o+8>>3])+(g=s[n+8>>3]),s[i+8>>3]=B+C,y=u+(D=s[i>>3]),d=c+t,s[i>>3]=y+d,b-=l,c-=t,s[e+8>>3]=b+c,u=D-u,t=w-g,s[e>>3]=u-t,s[o+8>>3]=B-C,s[o>>3]=y-d,s[n+8>>3]=b-c,s[n>>3]=u+t,M>>>0>(i=a+n|0)>>>0;);if(n=16,m=O=(e=Q)+(o=K=e>>1)|0,(0|a)>=17)for(;;){if(M>>>0>(i=r+n|0)>>>0)for(u=s[(p&m)+I>>3],c=s[(e&p)+I>>3],t=s[(o&p)+I>>3],b=s[(p&v-m)+I>>3],l=s[(p&v-e)+I>>3],B=s[(p&v-o)+I>>3];y=(w=s[i+8>>3])+(D=(g=s[(E=i+a|0)>>3])*l+c*(C=s[E+8>>3])),H=(N=(d=s[(U=a+E|0)>>3])*B+t*(Y=s[U+8>>3]))+(x=(J=s[(F=a+U|0)>>3])*b+u*(R=s[F+8>>3])),s[i+8>>3]=y+H,C=(G=s[i>>3])+(g=g*c-l*C),J=(d=d*t-B*Y)+(Y=J*u-b*R),s[i>>3]=C+J,w-=D,D=d-Y,s[E+8>>3]=w+D,g=G-g,d=N-x,s[E>>3]=g-d,s[U+8>>3]=y-H,s[U>>3]=C-J,s[F+8>>3]=w-D,s[F>>3]=g+d,M>>>0>(i=a+F|0)>>>0;);if(m=m+O|0,e=e+Q|0,o=o+K|0,!((0|a)>(0|(n=n+16|0))))break}if(Q>>=2,!(h>>>0>(A<<=2)>>>0))break}if((0|A)!=(0|h))break A;if(u=s[(o=r+P|0)>>3],c=s[r+8>>3],t=s[o+8>>3],s[r+8>>3]=c+t,b=s[r>>3],s[r>>3]=u+b,s[o+8>>3]=c-t,s[o>>3]=b-u,u=s[(A=P+(n=(m=h<<2)+r|0)|0)+8>>3],c=s[n+8>>3],t=s[A>>3],s[n+8>>3]=c+t,b=s[n>>3],s[n>>3]=b-u,s[A+8>>3]=c-t,s[A>>3]=b+u,n>>>0>o>>>0)break A;for(i=0,A=o;;){if(e=A+16|0,i=i+Q|0,(a=r+16|0)>>>0<n>>>0)for(;u=s[r+24>>3],h=e,c=s[a>>3],w=(t=s[e>>3])*(b=s[(i&p)+I>>3])-(l=s[(p&v-i)+I>>3])*(B=s[A+24>>3]),s[a>>3]=c+w,t=t*l+b*B,s[r+24>>3]=u+t,s[e>>3]=c-w,s[A+24>>3]=u-t,e=e+16|0,i=i+Q|0,A=h,r=a,(a=a+16|0)>>>0<n>>>0;);if(A=e,r=a,!(o>>>0>=(n=n+m|0)>>>0))break}break A}A=f[a>>2],u=s[A+24>>3],c=s[A+8>>3],t=s[A>>3],b=s[A+16>>3],s[r+16>>3]=t-b}s[r>>3]=t+b,s[r+24>>3]=c-u,s[r+8>>3]=c+u;break A}A=f[a>>2],e=f[A>>2],i=f[A+4>>2],a=f[A+12>>2],f[r+8>>2]=f[A+8>>2],f[r+12>>2]=a,f[r>>2]=e,f[r+4>>2]=i}},g:function(A){var e=0;(A|=0)&&((e=f[A+4>>2])&&C(e),(e=f[A+8>>2])&&C(e),(e=f[A+16>>2])&&C(e),C(A))},h:Y,i:m,j:C}}(A)}(L)},instantiate:function(A,e){return{then:function(e){var r=new b.Module(A);e({instance:new b.Instance(r)})}}},RuntimeError:Error};o=[],"object"!=typeof b&&E("no native wasm support detected");var s,k,l,w,g,d,h,p=!1;var m,B,C=e.INITIAL_MEMORY||16777216;(c=e.wasmMemory?e.wasmMemory:new b.Memory({initial:C/65536,maximum:C/65536}))&&(s=c.buffer),C=s.byteLength,s=m=s,e.HEAP8=k=new Int8Array(m),e.HEAP16=w=new Int16Array(m),e.HEAP32=g=new Int32Array(m),e.HEAPU8=l=new Uint8Array(m),e.HEAPU16=new Uint16Array(m),e.HEAPU32=new Uint32Array(m),e.HEAPF32=d=new Float32Array(m),e.HEAPF64=h=new Float64Array(m);var D=[],Q=[],v=[];var y=0,I=null,M=null;function E(A){e.onAbort&&e.onAbort(A),u(A="Aborted("+A+")"),p=!0,1,A+=". Build with -s ASSERTIONS=1 for more info.";var r=new b.RuntimeError(A);throw i(r),r}e.preloadedImages={},e.preloadedAudios={};var U,Y,F,J,P="data:application/octet-stream;base64,";function K(A){return A.startsWith(P)}function O(A){try{if(A==U&&o)return new Uint8Array(o);var e=G(A);if(e)return e;if(n)return n(A);throw"both async and sync fetching of the wasm failed"}catch(u){E(u)}}function N(A){for(;A.length>0;){var r=A.shift();if("function"!=typeof r){var i=r.func;"number"==typeof i?void 0===r.arg?x(i)():x(i)(r.arg):i(void 0===r.arg?null:r.arg)}else r(e)}}K(U="fft60.wasm")||(Y=U,U=e.locateFile?e.locateFile(Y,t):t+Y);var R=[];function x(A){var e=R[A];return e||(A>=R.length&&(R.length=A+1),R[A]=e=B.get(A)),e}var H="function"==typeof atob?atob:function(A){var e,r,i,n,f,a,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",o="",u=0;A=A.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{e=t.indexOf(A.charAt(u++))<<2|(n=t.indexOf(A.charAt(u++)))>>4,r=(15&n)<<4|(f=t.indexOf(A.charAt(u++)))>>2,i=(3&f)<<6|(a=t.indexOf(A.charAt(u++))),o+=String.fromCharCode(e),64!==f&&(o+=String.fromCharCode(r)),64!==a&&(o+=String.fromCharCode(i))}while(u<A.length);return o};function G(A){if(K(A))return function(A){try{for(var e=H(A),r=new Uint8Array(e.length),i=0;i<e.length;++i)r[i]=e.charCodeAt(i);return r}catch(n){throw new Error("Converting base64 string to bytes failed.")}}(A.slice(P.length))}var S,L={c:function(){E("")},b:function(A){l.length,E("OOM")},a:c};(function(){var A={a:L};function r(A,r){var i,n=A.exports;e.asm=n,B=e.asm.h,i=e.asm.d,Q.unshift(i),function(A){if(y--,e.monitorRunDependencies&&e.monitorRunDependencies(y),0==y&&(null!==I&&(clearInterval(I),I=null),M)){var r=M;M=null,r()}}()}function n(A){r(A.instance)}function f(e){return(o||"function"!=typeof fetch?Promise.resolve().then((function(){return O(U)})):fetch(U,{credentials:"same-origin"}).then((function(A){if(!A.ok)throw"failed to load wasm binary file at '"+U+"'";return A.arrayBuffer()})).catch((function(){return O(U)}))).then((function(e){return b.instantiate(e,A)})).then((function(A){return A})).then(e,(function(A){u("failed to asynchronously prepare wasm: "+A),E(A)}))}if(y++,e.monitorRunDependencies&&e.monitorRunDependencies(y),e.instantiateWasm)try{return e.instantiateWasm(A,r)}catch(a){return u("Module.instantiateWasm callback failed with error: "+a),!1}(o||"function"!=typeof b.instantiateStreaming||K(U)||"function"!=typeof fetch?f(n):fetch(U,{credentials:"same-origin"}).then((function(e){return b.instantiateStreaming(e,A).then(n,(function(A){return u("wasm streaming compile failed: "+A),u("falling back to ArrayBuffer instantiation"),f(n)}))}))).catch(i)})(),e.___wasm_call_ctors=function(){return(e.___wasm_call_ctors=e.asm.d).apply(null,arguments)},e._prepare_fft=function(){return(e._prepare_fft=e.asm.e).apply(null,arguments)},e._run_fft=function(){return(e._run_fft=e.asm.f).apply(null,arguments)},e._delete_fft=function(){return(e._delete_fft=e.asm.g).apply(null,arguments)},e._malloc=function(){return(e._malloc=e.asm.i).apply(null,arguments)},e._free=function(){return(e._free=e.asm.j).apply(null,arguments)};function V(A){function i(){S||(S=!0,e.calledRun=!0,p||(!0,N(Q),r(e),e.onRuntimeInitialized&&e.onRuntimeInitialized(),function(){if(e.postRun)for("function"==typeof e.postRun&&(e.postRun=[e.postRun]);e.postRun.length;)A=e.postRun.shift(),v.unshift(A);var A;N(v)}()))}A=A||a,y>0||(!function(){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)A=e.preRun.shift(),D.unshift(A);var A;N(D)}(),y>0||(e.setStatus?(e.setStatus("Running..."),setTimeout((function(){setTimeout((function(){e.setStatus("")}),1),i()}),1)):i()))}if(e.setValue=function(A,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"i8";switch("*"===r.charAt(r.length-1)&&(r="i32"),r){case"i1":case"i8":k[A>>0]=e;break;case"i16":w[A>>1]=e;break;case"i32":g[A>>2]=e;break;case"i64":J=[e>>>0,(F=e,+Math.abs(F)>=1?F>0?(0|Math.min(+Math.floor(F/4294967296),4294967295))>>>0:~~+Math.ceil((F-+(~~F>>>0))/4294967296)>>>0:0)],g[A>>2]=J[0],g[A+4>>2]=J[1];break;case"float":d[A>>2]=e;break;case"double":h[A>>3]=e;break;default:E("invalid type for setValue: "+r)}},e.getValue=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"i8";switch("*"===e.charAt(e.length-1)&&(e="i32"),e){case"i1":case"i8":return k[A>>0];case"i16":return w[A>>1];case"i32":case"i64":return g[A>>2];case"float":return d[A>>2];case"double":return Number(h[A>>3]);default:E("invalid type for getValue: "+e)}return null},M=function A(){S||V(),S||(M=A)},e.run=V,e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);e.preInit.length>0;)e.preInit.pop()();return V(),e.ready}}();"object"===typeof i&&"object"===typeof n?n.exports=f:"function"===typeof define&&define.amd?define([],(function(){return f})):"object"===typeof i&&(i.Module=f),e.default=n.exports}}]);
//# sourceMappingURL=144.c9a69ff7.chunk.js.map