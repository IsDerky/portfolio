import { H2, P, C, Pre, Rojo, Verde, Gris, Caja, Lista, Tabla, Cronologia, Figura, type Contenido } from '@/components/blog/Prosa';

// 0x34 ('4') frente a 0x74 ('t'): solo cambia el bit 6
const Bits = ({ etiquetas }: { etiquetas: [string, string] }) => {
  const filas = [[0, 0, 1, 1, 0, 1, 0, 0], [0, 1, 1, 1, 0, 1, 0, 0]];

  return (
    <svg viewBox="0 0 640 170" className="w-full min-w-[520px] h-auto font-mono" role="img" aria-label={`${etiquetas[0]} / ${etiquetas[1]}`}>
      {filas.map((bits, f) => (
        <g key={f}>
          <text x="20" y={48 + f * 70} className="fill-fg-muted" fontSize="14">{f === 0 ? "'4'  0x34" : "'t'  0x74"}</text>
          {bits.map((b, i) => {
            const cambia = i === 1;
            return (
              <g key={i}>
                <rect x={170 + i * 52} y={22 + f * 70} width="44" height="40" rx="8"
                  className={cambia && f === 1 ? 'fill-red-900/60 stroke-red-400' : cambia ? 'fill-surface-2 stroke-red-400' : 'fill-surface-2 stroke-fg-primary/20'} />
                <text x={192 + i * 52} y={48 + f * 70} textAnchor="middle" fontSize="16" className={cambia ? 'fill-red-300' : 'fill-fg-secondary'}>{b}</text>
              </g>
            );
          })}
        </g>
      ))}
      <text x="244" y="158" textAnchor="middle" fontSize="12" className="fill-red-400">bit 6</text>
    </svg>
  );
};

export const es: Contenido = {
  indice: [['sintoma', 'El síntoma'], ['pistas', 'Más pistas'], ['memtester', 'memtester sin reiniciar'], ['memtest', 'El parche: memtest=N'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>La copia nocturna empezó a fallar con un error raro sobre un índice. El índice estaba bien. Lo que estaba mal era un módulo de RAM que, de vez en cuando, devolvía un bit cambiado. Así lo encontré y así lo aparqué hasta poder cambiarlo.</P>

      <H2 id="sintoma">El síntoma</H2>
      <P>Las copias de mi servidor de casa van con restic a dos sitios: un disco local y la nube. Una noche la de la nube se paró con esto:</P>
      <Pre><Rojo>Fatal: DecodeIndex: invalid ID: encoding/hex: invalid byte: U+0074 &apos;t&apos;</Rojo></Pre>
      <P>restic guarda los identificadores en hexadecimal, así que una <C>t</C> no pinta nada ahí. Lo primero que piensa uno es que el repositorio se ha corrompido. Antes de tocar nada, bajé a local los índices y las claves del repositorio (no los datos) y los revisé uno a uno con <C>restic cat index</C>.</P>
      <P>Los 43 estaban bien. Tres de ellos fallaron la primera vez con «wrong password or no key found» y, al repetir, pasaron. Un fichero que unas veces se lee bien y otras no, sin que nadie lo toque, no es un problema del fichero.</P>
      <Caja tipo="ojo" titulo="La pista">La <C>t</C> es <C>0x74</C>. El carácter que tocaba, un <C>4</C>, es <C>0x34</C>. Entre los dos hay un solo bit de diferencia.</Caja>
      <Figura pie="Un solo bit separa un carácter válido de uno que rompe el índice."><Bits etiquetas={['0x34', '0x74']} /></Figura>

      <H2 id="pistas">Más pistas que no había juntado</H2>
      <P>Mirando atrás, había avisos sueltos que por separado no decían mucho:</P>
      <Cronologia puntos={[
        ['4 días antes', <>Un <C>hash mismatch</C> en otra comprobación de restic. Lo relancé, pasó y lo di por un fallo de red.</>],
        ['La noche anterior', <>Un proceso se cayó con <C>general protection fault</C>. Sin más.</>],
        ['00:31', <>El <C>DecodeIndex</C> de arriba. Relanzada a mano, la copia terminó bien.</>],
        ['08:04', <>El <C>check</C> de mantenimiento: cinco paquetes con «ciphertext verification failed», los cinco «check successful on second attempt».</>],
      ]} />
      <P>Los datos de la nube estaban bien: en el segundo intento todo cuadraba. Lo que fallaba era la lectura en mi máquina. El servidor no tiene RAM con ECC y <C>dmesg</C> no decía nada. Tocaba mirar la memoria.</P>
      <Caja tipo="mal" titulo="Lo que no hice">Lanzar <C>restic repair</C>. Con una RAM que cambia bits, «reparar» puede escribir basura encima de datos que estaban bien.</Caja>

      <H2 id="memtester">memtester sin reiniciar</H2>
      <P>Lo ideal es memtest86+ con el equipo parado, pero no quería tenerlo apagado horas sin saber nada. memtester prueba la RAM desde el propio sistema, así que lancé cuatro a la vez con prioridad baja, cada uno con un trozo de memoria:</P>
      <Pre><Gris># uno de los cuatro; con nice y poco peso de CPU para no ahogar lo demás</Gris>{'\n'}systemd-run --unit=memtest-1 -p Nice=19 -p CPUWeight=10 memtester 6G 3</Pre>
      <P>No hizo falta esperar. A los cinco minutos había quince fallos:</P>
      <Pre>{'  Compare XOR         : '}<Rojo>FAILURE: 0xfbffffffffffffff != 0xffffffffffffffff at offset 0x…</Rojo>{'\n  Compare SUB         : '}<Rojo>FAILURE: 0xfbff7f3e5c1a2d90 != 0xffff7f3e5c1a2d90 at offset 0x…</Rojo>{'\n  Bit Flip            : '}<Rojo>FAILURE: 0xfbffffffffffffff != 0xffffffffffffffff at offset 0x…</Rojo>{'\n  '}<Gris>…</Gris></Pre>
      <P>Casi todos con el mismo bit (el 58: <C>0xfb…</C> en vez de <C>0xff…</C>) y uno con el 56. Cuando el fallo cae siempre en el mismo bit, suele ser una línea de datos o un chip concreto: un módulo, no la placa. Dos de los cuatro procesos no vieron nada, seguramente porque les tocó memoria de otros módulos.</P>
      <Tabla cab={['Ranura', 'Módulo', 'Capacidad']} filas={[['1', 'DDR4-3200', '16 GB'], ['2', 'DDR4-3200', '8 GB'], ['3', 'DDR4-3200', '8 GB'], ['4', 'DDR4-3200', '8 GB']]} />
      <P>Cuatro módulos, todos funcionando a 2400. Lo normal sería quitarlos por mitades hasta dar con el malo, pero en ese momento no podía abrir la caja.</P>

      <H2 id="memtest">El parche: memtest=N en el núcleo</H2>
      <P>Linux tiene un parámetro de arranque, <C>memtest=</C>, que prueba la RAM muy al principio y reserva las direcciones que fallan para que nadie las use. No arregla el módulo, pero lo aparta mientras tanto. Se añade a la línea del núcleo en GRUB:</P>
      <Pre>GRUB_CMDLINE_LINUX_DEFAULT=&quot;quiet splash <Verde>memtest=17</Verde>&quot;</Pre>
      <P>Con <C>update-grub</C> y un reinicio (con las pruebas, el arranque tardó unos tres minutos), el núcleo dejó esto:</P>
      <Pre>{'early_memtest: # of tests: 17\n  '}<Rojo>0x…070 - 0x…078 pattern 0000000000000000</Rojo>{'\n  '}<Rojo>0x…1f8 - 0x…200 pattern 0000000000000000</Rojo></Pre>
      <P>Dos direcciones apartadas, que terminan igual que las que había visto memtester. Son las mismas celdas. Después, otra pasada de memtester:</P>
      <Pre><Verde>21 minutos, 4 procesos, 0 fallos</Verde>{'   '}<Gris># antes: 15 en 5 minutos</Gris></Pre>
      <Caja tipo="bien" titulo="Ojo con el parche">Solo aparta lo que falla al arrancar. Si el módulo empeora, saldrán celdas nuevas que no están reservadas. Las copias siguen comprobándose y, si vuelven los errores raros, es la señal de que toca cambiarlo ya.</Caja>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li><strong>Una comprobación que falla y luego pasa es una pista, no un fallo de red.</strong> Si lo hubiera mirado con el primer <C>hash mismatch</C>, me ahorraba cuatro días.</li>
        <li><strong>Las copias con comprobación de integridad son también un detector de hardware.</strong> restic lee y verifica cada byte; casi nada más en el sistema lo hace.</li>
        <li><strong>Antes de reparar, mirar.</strong> Copié los índices a local y los revisé sin tocar el repositorio. Bajarlos primero, además, fue mucho más rápido que leerlos uno a uno desde la nube.</li>
        <li><strong>memtester sirve para encontrar el problema rápido sin parar la máquina,</strong> y <C>memtest=</C> para seguir tirando hasta que se pueda cambiar la pieza.</li>
      </Lista>
    </>
  ),
};

export const en: Contenido = {
  indice: [['sintoma', 'The symptom'], ['pistas', 'More clues'], ['memtester', 'memtester without rebooting'], ['memtest', 'The workaround: memtest=N'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>The nightly backup started failing with an odd error about an index. The index was fine. What was wrong was a RAM module that, every now and then, returned a flipped bit. This is how I found it and how I parked it until I could replace it.</P>

      <H2 id="sintoma">The symptom</H2>
      <P>My home server backs up with restic to two places: a local disk and the cloud. One night the cloud one stopped with this:</P>
      <Pre><Rojo>Fatal: DecodeIndex: invalid ID: encoding/hex: invalid byte: U+0074 &apos;t&apos;</Rojo></Pre>
      <P>restic stores IDs in hexadecimal, so a <C>t</C> has no business being there. Your first thought is a corrupted repository. Before touching anything, I copied the repository indexes and keys (not the data) to a local folder and checked them one by one with <C>restic cat index</C>.</P>
      <P>All 43 were fine. Three of them failed the first time with “wrong password or no key found” and passed on a retry. A file that sometimes reads fine and sometimes doesn’t, with nobody touching it, isn’t a problem with the file.</P>
      <Caja tipo="ojo" titulo="The clue">The <C>t</C> is <C>0x74</C>. The character that should have been there, a <C>4</C>, is <C>0x34</C>. They differ by a single bit.</Caja>
      <Figura pie="A single bit separates a valid character from one that breaks the index."><Bits etiquetas={['0x34', '0x74']} /></Figura>

      <H2 id="pistas">Clues I hadn’t put together</H2>
      <P>Looking back, there were scattered warnings that didn’t say much on their own:</P>
      <Cronologia puntos={[
        ['4 days before', <>A <C>hash mismatch</C> in another restic check. I re-ran it, it passed and I blamed the network.</>],
        ['The night before', <>A process died with a <C>general protection fault</C>. Nothing else.</>],
        ['00:31', <>The <C>DecodeIndex</C> above. Re-run by hand, the backup finished fine.</>],
        ['08:04', <>The maintenance <C>check</C>: five packs with “ciphertext verification failed”, all five “check successful on second attempt”.</>],
      ]} />
      <P>The data in the cloud was fine: on the second attempt everything matched. What failed was reading it on my machine. The server has no ECC RAM and <C>dmesg</C> said nothing. Time to look at the memory.</P>
      <Caja tipo="mal" titulo="What I didn’t do">Run <C>restic repair</C>. With RAM that flips bits, “repairing” can write garbage over data that was fine.</Caja>

      <H2 id="memtester">memtester without rebooting</H2>
      <P>The ideal is memtest86+ with the machine down, but I didn’t want it off for hours without knowing anything. memtester tests RAM from the running system, so I started four of them at low priority, each with a chunk of memory:</P>
      <Pre><Gris># one of the four; nice and a small CPU weight so it doesn’t starve everything else</Gris>{'\n'}systemd-run --unit=memtest-1 -p Nice=19 -p CPUWeight=10 memtester 6G 3</Pre>
      <P>No need to wait. After five minutes there were fifteen failures:</P>
      <Pre>{'  Compare XOR         : '}<Rojo>FAILURE: 0xfbffffffffffffff != 0xffffffffffffffff at offset 0x…</Rojo>{'\n  Compare SUB         : '}<Rojo>FAILURE: 0xfbff7f3e5c1a2d90 != 0xffff7f3e5c1a2d90 at offset 0x…</Rojo>{'\n  Bit Flip            : '}<Rojo>FAILURE: 0xfbffffffffffffff != 0xffffffffffffffff at offset 0x…</Rojo>{'\n  '}<Gris>…</Gris></Pre>
      <P>Almost all of them on the same bit (bit 58: <C>0xfb…</C> instead of <C>0xff…</C>) and one on bit 56. When failures always hit the same bit, it’s usually one data line or one chip: a module, not the motherboard. Two of the four processes saw nothing, probably because they got memory from other modules.</P>
      <Tabla cab={['Slot', 'Module', 'Size']} filas={[['1', 'DDR4-3200', '16 GB'], ['2', 'DDR4-3200', '8 GB'], ['3', 'DDR4-3200', '8 GB'], ['4', 'DDR4-3200', '8 GB']]} />
      <P>Four modules, all running at 2400. The usual move is removing them half at a time until you find the bad one, but I couldn’t open the case at that point.</P>

      <H2 id="memtest">The workaround: memtest=N in the kernel</H2>
      <P>Linux has a boot parameter, <C>memtest=</C>, that tests RAM very early and reserves the addresses that fail so nothing uses them. It doesn’t fix the module, but it sets it aside in the meantime. It goes on the kernel line in GRUB:</P>
      <Pre>GRUB_CMDLINE_LINUX_DEFAULT=&quot;quiet splash <Verde>memtest=17</Verde>&quot;</Pre>
      <P>After <C>update-grub</C> and a reboot (with the tests, booting took about three minutes), the kernel left this:</P>
      <Pre>{'early_memtest: # of tests: 17\n  '}<Rojo>0x…070 - 0x…078 pattern 0000000000000000</Rojo>{'\n  '}<Rojo>0x…1f8 - 0x…200 pattern 0000000000000000</Rojo></Pre>
      <P>Two addresses set aside, ending the same way as the ones memtester had seen. Same cells. Then, another memtester run:</P>
      <Pre><Verde>21 minutes, 4 processes, 0 failures</Verde>{'   '}<Gris># before: 15 in 5 minutes</Gris></Pre>
      <Caja tipo="bien" titulo="Careful with the workaround">It only sets aside what fails at boot. If the module gets worse, new cells will show up that aren’t reserved. The backups keep being checked, and if the odd errors come back, that’s the sign it has to be replaced now.</Caja>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li><strong>A check that fails and then passes is a clue, not a network hiccup.</strong> Had I looked at the first <C>hash mismatch</C>, I’d have saved four days.</li>
        <li><strong>Backups with integrity checks are also a hardware detector.</strong> restic reads and verifies every byte; almost nothing else on the system does.</li>
        <li><strong>Look before you repair.</strong> I copied the indexes locally and checked them without touching the repository. Downloading them first was also much faster than reading them one by one from the cloud.</li>
        <li><strong>memtester finds the problem fast without stopping the machine,</strong> and <C>memtest=</C> keeps you going until the part can be swapped.</li>
      </Lista>
    </>
  ),
};
