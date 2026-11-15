import { H2, P, C, Pre, Gris, Verde, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['por-que', 'Por qué dos repos'], ['reparto', 'Qué va en cada uno'], ['roles', 'Roles que no saben nada de mí'], ['antes-de-publicar', 'Antes de cada push'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Todo lo que corre en mi servidor de casa está en Ansible: el SSH, el cortafuegos, las copias, la monitorización, los servicios. Quería enseñar ese código, porque es de lo que más he aprendido, pero el inventario dice qué máquinas tengo, dónde están y con qué contraseñas. La solución fue partirlo en dos repositorios.</P>

      <H2 id="por-que">Por qué dos repos</H2>
      <P>Un solo repo privado es lo cómodo, pero entonces nadie ve el trabajo. Un solo repo público con los secretos cifrados con Vault parece suficiente, y no lo es: aunque las contraseñas vayan cifradas, los nombres de las máquinas, las IPs de la red de casa, los dominios internos y qué servicios hay en cada sitio van en claro. Eso es un mapa para quien quiera entrar.</P>

      <H2 id="reparto">Qué va en cada uno</H2>
      <Tabla cab={['Repo público', 'Repo privado']} filas={[
        ['Roles (tareas, plantillas, handlers)', 'inventory.ini con las máquinas reales'],
        ['Playbooks', 'group_vars y host_vars con los valores'],
        ['defaults/ con valores genéricos o vacíos', 'vault.yml cifrado con ansible-vault'],
        ['inventory.example.ini para copiar', 'Nada de código'],
        ['README de cada rol con su tabla de variables', ''],
      ]} />
      <P>Para que los playbooks del público lean el inventario del privado, no hace falta copiar nada: basta con apuntar a él desde fuera.</P>
      <Pre><Gris># en el portátil, fuera de los dos repos</Gris>{'\n'}export ANSIBLE_INVENTORY=~/projects/config-privada/inventory.ini{'\n'}export ANSIBLE_VAULT_PASSWORD_FILE=~/.config/ansible/vault-pass{'\n\n'}ansible-playbook playbooks/backup.yml --check --diff</Pre>
      <P>Los <C>group_vars</C> que están junto al inventario se cargan solos, así que el rol recibe sus valores sin saber de dónde vienen. La contraseña de Vault vive en un fichero con permisos 600 fuera de cualquier repo.</P>

      <H2 id="roles">Roles que no saben nada de mí</H2>
      <P>La regla es que un rol del repo público tiene que poder usarlo otra persona. En la práctica:</P>
      <Lista>
        <li><strong>Secretos vacíos por defecto.</strong> Una contraseña nunca tiene un valor de ejemplo en <C>defaults/</C>; va vacía y el rol se niega a seguir si nadie la ha puesto.</li>
        <li><strong>Comprobaciones al principio.</strong> Antes de tocar nada, el rol mira que las variables obligatorias existen y tienen buena pinta.</li>
        <li><strong>Nada de IPs ni dominios en las plantillas.</strong> Todo sale de variables.</li>
      </Lista>
      <Pre>- name: Faltan variables{'\n'}  ansible.builtin.assert:{'\n'}    that:{'\n'}      - backup_password | length &gt;= 20{'\n'}      - backup_destino is match(&apos;^[a-z0-9-]+:&apos;){'\n'}    fail_msg: Define backup_password (en el vault) y backup_destino.{'\n'}    quiet: true</Pre>
      <Caja tipo="ojo" titulo="El vault también se rompe">Si borras una variable del vault sin darte cuenta, el rol con un <C>default(&apos;&apos;)</C> seguiría como si nada y dejaría un servicio sin contraseña. Por eso el <C>assert</C> va en el rol y no en el inventario: falla aunque el inventario esté mal.</Caja>

      <H2 id="antes-de-publicar">Antes de cada push</H2>
      <P>El riesgo real no está en los roles bien hechos, sino en el día que pegas un ejemplo con un valor de verdad. Tengo tres filtros:</P>
      <Lista>
        <li><strong>pre-commit</strong> con ansible-lint y yamllint, que también obliga a que los nombres de las tareas digan algo.</li>
        <li><strong>Un grep de patrones</strong> sobre lo que se va a subir: rangos de IP privados, el nombre de mis dominios internos, el usuario de mi máquina, la palabra «password» seguida de algo que no sea una variable. Si sale algo, no hay push.</li>
        <li><strong>Pasar en seco.</strong> <C>--check --diff</C> contra las máquinas reales antes de aplicar, y una segunda pasada después que tiene que terminar con <Verde>changed=0</Verde>. Si la segunda cambia algo, el rol no es idempotente y lo arreglo antes de publicarlo.</li>
      </Lista>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Cifrar los secretos no basta: el inventario en claro también cuenta cosas.</li>
        <li>Escribir cada rol pensando en un desconocido lo hace mejor también para mí: menos supuestos escondidos y un README que me sirve cuando vuelvo meses después.</li>
        <li>El <C>changed=0</C> de la segunda pasada es la mejor prueba barata que hay.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['por-que', 'Why two repos'], ['reparto', 'What goes where'], ['roles', 'Roles that know nothing about me'], ['antes-de-publicar', 'Before every push'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>Everything running on my home server is in Ansible: SSH, the firewall, backups, monitoring, services. I wanted to show that code, since it’s where I’ve learned the most, but the inventory says which machines I have, where they are and with which passwords. The answer was splitting it into two repositories.</P>

      <H2 id="por-que">Why two repos</H2>
      <P>One private repo is the comfortable option, but then nobody sees the work. One public repo with secrets encrypted with Vault looks like enough, and it isn’t: even with encrypted passwords, machine names, home network IPs, internal domains and which service runs where are all in plain text. That’s a map for anyone who wants in.</P>

      <H2 id="reparto">What goes where</H2>
      <Tabla cab={['Public repo', 'Private repo']} filas={[
        ['Roles (tasks, templates, handlers)', 'inventory.ini with the real machines'],
        ['Playbooks', 'group_vars and host_vars with the values'],
        ['defaults/ with generic or empty values', 'vault.yml encrypted with ansible-vault'],
        ['inventory.example.ini to copy', 'No code at all'],
        ['A README per role with its variables table', ''],
      ]} />
      <P>For the public playbooks to read the private inventory, nothing needs copying: just point at it from outside.</P>
      <Pre><Gris># on the laptop, outside both repos</Gris>{'\n'}export ANSIBLE_INVENTORY=~/projects/private-config/inventory.ini{'\n'}export ANSIBLE_VAULT_PASSWORD_FILE=~/.config/ansible/vault-pass{'\n\n'}ansible-playbook playbooks/backup.yml --check --diff</Pre>
      <P>The <C>group_vars</C> next to the inventory load on their own, so the role gets its values without knowing where they come from. The Vault password lives in a 600-permission file outside any repo.</P>

      <H2 id="roles">Roles that know nothing about me</H2>
      <P>The rule is that a role in the public repo must be usable by someone else. In practice:</P>
      <Lista>
        <li><strong>Secrets empty by default.</strong> A password never has an example value in <C>defaults/</C>; it’s empty and the role refuses to continue if nobody set it.</li>
        <li><strong>Checks first.</strong> Before touching anything, the role checks that required variables exist and look right.</li>
        <li><strong>No IPs or domains in templates.</strong> Everything comes from variables.</li>
      </Lista>
      <Pre>- name: Missing variables{'\n'}  ansible.builtin.assert:{'\n'}    that:{'\n'}      - backup_password | length &gt;= 20{'\n'}      - backup_target is match(&apos;^[a-z0-9-]+:&apos;){'\n'}    fail_msg: Set backup_password (in the vault) and backup_target.{'\n'}    quiet: true</Pre>
      <Caja tipo="ojo" titulo="The vault breaks too">If you delete a vault variable by accident, a role with <C>default(&apos;&apos;)</C> would carry on and leave a service without a password. That’s why the <C>assert</C> lives in the role and not the inventory: it fails even if the inventory is wrong.</Caja>

      <H2 id="antes-de-publicar">Before every push</H2>
      <P>The real risk isn’t well-written roles, it’s the day you paste an example with a real value. I have three filters:</P>
      <Lista>
        <li><strong>pre-commit</strong> with ansible-lint and yamllint, which also forces task names that say something.</li>
        <li><strong>A pattern grep</strong> over what’s about to be pushed: private IP ranges, my internal domain names, my machine’s username, the word “password” followed by something that isn’t a variable. If anything shows up, no push.</li>
        <li><strong>A dry run.</strong> <C>--check --diff</C> against the real machines before applying, and a second run afterwards that has to end with <Verde>changed=0</Verde>. If the second run changes anything, the role isn’t idempotent and I fix it before publishing.</li>
      </Lista>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>Encrypting secrets isn’t enough: a plain-text inventory tells a story too.</li>
        <li>Writing each role for a stranger makes it better for me as well: fewer hidden assumptions and a README that helps when I come back months later.</li>
        <li>The <C>changed=0</C> of the second run is the best cheap test there is.</li>
      </Lista>
    </>
  ),
};
