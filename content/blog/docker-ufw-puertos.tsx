import { H2, P, C, Pre, Gris, Rojo, Verde, Caja, Lista, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['ufw', 'Docker se salta ufw'], ['por-que', 'Por qué pasa'], ['soluciones', 'Cómo lo hago ahora'], ['puerto-80', 'El puerto 80 compartido'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Dos historias con la misma moraleja: un puerto puede estar abierto o cerrado por motivos que no ves en la configuración que estás mirando.</P>

      <H2 id="ufw">Docker se salta ufw</H2>
      <P>La prueba es fácil: ufw cerrando todo por defecto, solo unos pocos puertos abiertos, y un contenedor cualquiera publicado con <C>-p 8080:80</C>. Desde fuera, responde.</P>
      <Pre>$ sudo ufw status{'\n'}<Gris>Status: active{'\n'}Default: deny (incoming)</Gris>{'\n'}{'\n'}$ curl -I http://mi-ip-publica:8080{'\n'}<Rojo>HTTP/1.1 200 OK</Rojo></Pre>

      <H2 id="por-que">Por qué pasa</H2>
      <P>ufw pone sus reglas en la cadena <C>INPUT</C> de iptables. Pero el tráfico hacia un puerto publicado por Docker no va a <C>INPUT</C>: Docker lo redirige con NAT al contenedor y pasa por <C>FORWARD</C>, donde Docker mete sus propias reglas por delante. ufw ni se entera.</P>
      <Caja tipo="mal" titulo="Lo peligroso">No es un fallo, es como funciona. Pero si alguien publica una base de datos con <C>-p 5432:5432</C> pensando que el cortafuegos la protege, la base está en internet.</Caja>

      <H2 id="soluciones">Cómo lo hago ahora</H2>
      <Lista>
        <li><strong>Publicar solo en localhost</strong> lo que va detrás de un proxy: <C>-p 127.0.0.1:8080:80</C>. El proxy lo sirve y nada más llega.</li>
        <li><strong>Red del host y atado a una IP concreta</strong> para lo interno, como las bases de datos. Con <C>network_mode: host</C> el servicio escucha en la máquina como cualquier otro, así que su tráfico sí pasa por <C>INPUT</C> y por ufw. Lo ato a la IP del túnel privado y el cortafuegos decide quién entra.</li>
        <li><strong>La cadena <C>DOCKER-USER</C></strong> cuando necesito filtrar lo que sale de un contenedor, como en la honeypot: Docker la respeta y va antes que sus reglas.</li>
        <li><strong>Comprobarlo desde fuera</strong>, no desde la propia máquina. Desde dentro todo «funciona».</li>
      </Lista>

      <H2 id="puerto-80">El puerto 80 compartido</H2>
      <P>La segunda historia. En unas máquinas, el certificado de un servicio se renueva con certbot en modo <C>standalone</C>: cada dos meses levanta un servidor web propio en el puerto 80 un momento, responde al reto de Let’s Encrypt y se va. Para eso el 80 tiene que estar libre.</P>
      <P>Hace poco puse Caddy en esas mismas máquinas para servir webs por HTTPS. Lo configuré para escuchar solo en el 443. Y aun así, al cargarle la configuración, Caddy abrió también el 80: su HTTPS automático crea por su cuenta un servidor que redirige de HTTP a HTTPS.</P>
      <P>Nada falla ese día. Falla dos meses después, cuando certbot intenta renovar y encuentra el 80 ocupado. El certificado caduca y el servicio deja de funcionar.</P>
      <P>Lo pillé por casualidad: en el entorno de pruebas el 80 ya estaba ocupado por otra cosa y Caddy se negó a cargar la configuración.</P>
      <Pre><Rojo>loading new config: http app module: start: listening on :80: bind: address already in use</Rojo></Pre>
      <P>La solución fue decirle a Caddy dos cosas: que no cree esas redirecciones y que pida sus certificados solo por el 443 (reto TLS-ALPN), sin tocar el 80.</P>
      <Pre>{'"automatic_https": { "disable_redirects": true }\n'}<Gris>…</Gris>{'\n"issuers": [{ "module": "acme", "challenges": { "http": { "disabled": true } } }]'}</Pre>
      <P>Y la prueba se quedó para siempre: con el 80 ocupado, cargar la configuración tiene que funcionar y en los logs de Caddy no puede aparecer el 80.</P>
      <Pre><Verde>OK   POST /load con acme sin reto HTTP</Verde>{'\n'}<Verde>OK   no toca el 80</Verde></Pre>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Mira los puertos desde fuera, con lo que ve internet, no con lo que dice la configuración.</li>
        <li>Si dos programas pueden querer el mismo puerto, pruébalo con el puerto ocupado.</li>
        <li>Lo que se rompe en una renovación no se ve hasta dentro de dos meses: <C>certbot renew --dry-run</C> después de cualquier cambio que toque los puertos 80 o 443.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['ufw', 'Docker bypasses ufw'], ['por-que', 'Why it happens'], ['soluciones', 'How I do it now'], ['puerto-80', 'The shared port 80'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>Two stories with the same moral: a port can be open or closed for reasons you can’t see in the configuration you’re looking at.</P>

      <H2 id="ufw">Docker bypasses ufw</H2>
      <P>The test is easy: ufw denying everything by default, only a few ports open, and any container published with <C>-p 8080:80</C>. From outside, it answers.</P>
      <Pre>$ sudo ufw status{'\n'}<Gris>Status: active{'\n'}Default: deny (incoming)</Gris>{'\n'}{'\n'}$ curl -I http://my-public-ip:8080{'\n'}<Rojo>HTTP/1.1 200 OK</Rojo></Pre>

      <H2 id="por-que">Why it happens</H2>
      <P>ufw puts its rules in iptables’ <C>INPUT</C> chain. But traffic to a port published by Docker doesn’t go to <C>INPUT</C>: Docker NATs it to the container and it goes through <C>FORWARD</C>, where Docker puts its own rules first. ufw never sees it.</P>
      <Caja tipo="mal" titulo="The dangerous part">It isn’t a bug, it’s how it works. But if someone publishes a database with <C>-p 5432:5432</C> thinking the firewall protects it, that database is on the internet.</Caja>

      <H2 id="soluciones">How I do it now</H2>
      <Lista>
        <li><strong>Publish only on localhost</strong> anything behind a proxy: <C>-p 127.0.0.1:8080:80</C>. The proxy serves it and nothing else reaches it.</li>
        <li><strong>Host network bound to a specific IP</strong> for internal things like databases. With <C>network_mode: host</C> the service listens on the machine like any other, so its traffic does go through <C>INPUT</C> and ufw. I bind it to the private tunnel IP and let the firewall decide who gets in.</li>
        <li><strong>The <C>DOCKER-USER</C> chain</strong> when I need to filter what leaves a container, as with the honeypot: Docker honours it and it runs before its own rules.</li>
        <li><strong>Check from outside</strong>, not from the machine itself. From inside, everything “works”.</li>
      </Lista>

      <H2 id="puerto-80">The shared port 80</H2>
      <P>Second story. On some machines, a service’s certificate is renewed by certbot in <C>standalone</C> mode: every two months it briefly starts its own web server on port 80, answers Let’s Encrypt’s challenge and leaves. For that, port 80 has to be free.</P>
      <P>Recently I put Caddy on those same machines to serve websites over HTTPS. I configured it to listen only on 443. Even so, when its configuration was loaded, Caddy opened 80 too: its automatic HTTPS creates a server that redirects HTTP to HTTPS on its own.</P>
      <P>Nothing breaks that day. It breaks two months later, when certbot tries to renew and finds port 80 taken. The certificate expires and the service stops working.</P>
      <P>I caught it by chance: in the test environment port 80 was already used by something else and Caddy refused to load the configuration.</P>
      <Pre><Rojo>loading new config: http app module: start: listening on :80: bind: address already in use</Rojo></Pre>
      <P>The fix was telling Caddy two things: don’t create those redirects, and get certificates only through 443 (the TLS-ALPN challenge), without touching 80.</P>
      <Pre>{'"automatic_https": { "disable_redirects": true }\n'}<Gris>…</Gris>{'\n"issuers": [{ "module": "acme", "challenges": { "http": { "disabled": true } } }]'}</Pre>
      <P>And the test stayed for good: with port 80 taken, loading the configuration must work and port 80 must not appear in Caddy’s logs.</P>
      <Pre><Verde>OK   POST /load with acme and no HTTP challenge</Verde>{'\n'}<Verde>OK   doesn’t touch port 80</Verde></Pre>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>Check ports from outside, with what the internet sees, not with what the configuration says.</li>
        <li>If two programs might want the same port, test with that port taken.</li>
        <li>What breaks a renewal won’t show for two months: <C>certbot renew --dry-run</C> after any change touching ports 80 or 443.</li>
      </Lista>
    </>
  ),
};
