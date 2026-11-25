import { H2, P, C, Pre, Gris, Caja, Lista, Tabla, type Contenido } from '@/components/blog/Prosa';

export const es: Contenido = {
  indice: [['por-que', 'Por qué'], ['pila', 'La pila'], ['conpty', 'Pelearse con ConPTY'], ['claude', 'Claude por stream-json'], ['numeros', 'Los números'], ['aprendido', 'Lo aprendido']],
  cuerpo: (
    <>
      <P>Pasaba el día con dos ventanas: el terminal y Claude Code en otra. Claude no veía lo que salía en mis terminales y yo copiaba y pegaba errores de un lado a otro. Así que me hice un terminal con Claude dentro. Se llama Kyu, está en Rust y lo uso a diario.</P>

      <H2 id="por-que">Por qué</H2>
      <P>No quería un chat pegado a un terminal, sino que se conocieran. Que Claude arranque en la carpeta del terminal que tengo delante, que me pida permiso enseñando el diff del cambio, que los archivos que toca se abran con lo cambiado marcado y que, si le dejo, pueda ejecutar una orden en un terminal que yo vea.</P>

      <H2 id="pila">La pila</H2>
      <P>La primera versión fue con egui, todo en Rust. Funcionaba, pero se veía como una herramienta de hace diez años y cada detalle de la interfaz costaba el triple. La rehíce con Tauri 2: el núcleo sigue en Rust (terminales, archivos, git, el proceso de Claude) y la interfaz es React con xterm.js dibujando el terminal por WebGL.</P>
      <Lista>
        <li><strong>Rust</strong> abre las shells con <C>portable-pty</C> y les pasa los bytes tal cual a la interfaz por un canal de Tauri.</li>
        <li><strong>xterm.js</strong> pinta el terminal. Encima va una capa propia con un título por orden: carpeta, rama, RAM, resultado y lo que tardó.</li>
        <li><strong>El prompt</strong> manda marcas invisibles (OSC 133 y una propia) para que Kyu sepa dónde empieza y acaba cada orden y con qué código terminó, tanto en PowerShell como en bash.</li>
      </Lista>

      <H2 id="conpty">Pelearse con ConPTY</H2>
      <P>En Windows, un terminal no habla con la shell directamente: en medio está ConPTY, la capa de la consola que traduce entre el mundo de las consolas de Windows y las secuencias de escape. Me costó más horas que cualquier otra parte.</P>
      <Caja tipo="mal" titulo="La shell que no arrancaba">A veces la ventana se quedaba en blanco y la shell existía pero no hacía nada: un hilo y cero CPU. ConPTY, al abrirse, pregunta al terminal dónde está el cursor y no arranca la shell hasta que le contestan. xterm.js contestaba, pero la respuesta llegaba antes de que Kyu supiera a qué shell mandarla y se perdía. Ahora se guarda en una cola y se envía en cuanto hay shell.</Caja>
      <P>La segunda: al dividir un panel, el texto salía duplicado. ConPTY repinta la pantalla entera en cada cambio de tamaño, y si el panel pasa por varios tamaños seguidos repinta 28 filas en un terminal que ya solo tiene 14. Lo que sobra cae al historial. La solución fue esperar 100 ms desde el último cambio antes de avisar del tamaño nuevo.</P>
      <P>La tercera, las imágenes. xterm.js sabe pintar sixel, pero el ConPTY de Windows se las come por el camino. Kyu lleva su propio <C>conpty.dll</C> y <C>OpenConsole.exe</C>, los del paquete oficial de Microsoft, que sí las dejan pasar. <C>portable-pty</C> carga primero el <C>conpty.dll</C> que hay junto al ejecutable, así que basta con ponerlo ahí.</P>

      <H2 id="claude">Claude por stream-json</H2>
      <P>Claude Code tiene un modo sin interfaz que habla JSON por la entrada y la salida estándar. Kyu lo arranca así y lee los eventos línea a línea:</P>
      <Pre>
        claude -p --input-format stream-json --output-format stream-json{'\n'}
        {'  '}--verbose --include-partial-messages --permission-prompt-tool stdio
      </Pre>
      <Lista>
        <li>El texto llega en trozos (<C>stream_event</C>), así que la respuesta se va escribiendo como en la terminal.</li>
        <li>Cuando quiere usar una herramienta, llega una petición <C>can_use_tool</C> con lo que va a hacer. Kyu lee el archivo antes del cambio, enseña el diff y contesta permitir o denegar, con un mensaje si quiero.</li>
        <li>Para que pueda usar los terminales, Kyu levanta un servidor MCP pequeño en <C>127.0.0.1</C> con una clave nueva en cada arranque. Leer y listar no piden permiso; ejecutar, siempre.</li>
      </Lista>
      <Caja tipo="ojo" titulo="Ejecutar en un terminal a la vista">Cuando Claude ejecuta algo, lo hace en un panel «Claude» que se abre al lado, sin quitarme el foco. Kyu espera al prompt, escribe la orden, espera a que el bloque termine y le devuelve la salida. Si yo estaba escribiendo algo en ese terminal, no lo pisa.</Caja>

      <H2 id="numeros">Los números</H2>
      <P>Lo medí contra Windows Terminal en mi equipo (Ryzen 9 5900X) con un script que arranca, espera a la shell y mide memoria:</P>
      <Tabla
        cab={['', 'Kyu', 'Windows Terminal']}
        filas={[
          ['Arranque hasta la shell', '2,6 s', '2,1 s'],
          ['Memoria total', '516 MB', '213 MB'],
          ['Volcar 10,7 MB de texto', '~0,45 s', '~0,45 s'],
        ]}
      />
      <P>En velocidad de salida están iguales. En memoria pierde: el ejecutable de Kyu ocupa 31 MB y casi todo lo demás es WebView2, que con el dibujado por GPU se lleva más de 100 MB. Ahora, cuando la ventana lleva un rato sin foco, le pido a WebView2 que suelte memoria, las pestañas ocultas sueltan su contexto WebGL y el panel de Claude, el editor y los ajustes se cargan cuando se abren. Es el precio de hacer la interfaz con tecnología web, y lo acepto a cambio de lo fácil que es hacerla bien.</P>

      <H2 id="aprendido">Lo aprendido</H2>
      <Lista>
        <li>Un terminal es mucho más que pintar texto: casi todo el trabajo está en los bordes (tamaños, codificación, AltGr, pegar, la shell que se cierra).</li>
        <li>En Windows, cuando algo raro pasa entre el terminal y la shell, la respuesta casi siempre es ConPTY.</li>
        <li>Las pruebas automáticas del navegador no lo ven todo. Arrastrar pestañas funcionaba en la prueba y no con el ratón de verdad, porque Tauri se quedaba los arrastres para soltar archivos del Explorador.</li>
        <li>Hacerme la herramienta con la que trabajo cambia cómo trabajo: cada cosa que me molestaba ahora tiene arreglo.</li>
      </Lista>
      <P>El código está en <C>github.com/IsDerky/kyu-terminal</C>, con instaladores para Windows y Linux.</P>
      <P><Gris>Y sí, buena parte de Kyu la he escrito con Claude dentro de Kyu.</Gris></P>
    </>
  ),
};

export const en: Contenido = {
  indice: [['por-que', 'Why'], ['pila', 'The stack'], ['conpty', 'Fighting ConPTY'], ['claude', 'Claude over stream-json'], ['numeros', 'The numbers'], ['aprendido', 'What I learned']],
  cuerpo: (
    <>
      <P>I spent my days with two windows: the terminal, and Claude Code in another one. Claude couldn’t see what my terminals printed and I kept copying errors from one to the other. So I built a terminal with Claude inside. It’s called Kyu, it’s written in Rust and I use it every day.</P>

      <H2 id="por-que">Why</H2>
      <P>I didn’t want a chat glued to a terminal, I wanted them to know about each other. Claude starting in the folder of the terminal in front of me, asking for permission by showing the diff of the change, files it touches opening with the changes highlighted and, if I allow it, running a command in a terminal I can see.</P>

      <H2 id="pila">The stack</H2>
      <P>The first version used egui, all Rust. It worked, but it looked like a tool from ten years ago and every interface detail took three times as long. I rebuilt it on Tauri 2: the core is still Rust (terminals, files, git, the Claude process) and the interface is React, with xterm.js drawing the terminal over WebGL.</P>
      <Lista>
        <li><strong>Rust</strong> opens the shells with <C>portable-pty</C> and passes the raw bytes to the interface over a Tauri channel.</li>
        <li><strong>xterm.js</strong> draws the terminal. On top there’s a layer of my own with a header per command: folder, branch, RAM, result and duration.</li>
        <li><strong>The prompt</strong> emits invisible marks (OSC 133 plus one of my own) so Kyu knows where each command starts and ends and its exit code, in both PowerShell and bash.</li>
      </Lista>

      <H2 id="conpty">Fighting ConPTY</H2>
      <P>On Windows a terminal doesn’t talk to the shell directly: ConPTY sits in between, the console layer that translates between Windows consoles and escape sequences. It took me more hours than any other part.</P>
      <Caja tipo="mal" titulo="The shell that never started">Sometimes the window stayed blank and the shell existed but did nothing: one thread, zero CPU. When it opens, ConPTY asks the terminal where the cursor is and won’t start the shell until it gets an answer. xterm.js answered, but the reply arrived before Kyu knew which shell to send it to, and it was dropped. Now it’s queued and sent as soon as there is a shell.</Caja>
      <P>The second: splitting a pane duplicated text. ConPTY repaints the whole screen on every resize, and if the pane goes through several sizes in a row it repaints 28 rows into a terminal that only has 14 now. The overflow ends up in the scrollback. The fix was to wait 100 ms after the last change before reporting the new size.</P>
      <P>The third, images. xterm.js can draw sixel, but the ConPTY in Windows eats it on the way. Kyu ships its own <C>conpty.dll</C> and <C>OpenConsole.exe</C>, from Microsoft’s official package, which let it through. <C>portable-pty</C> loads the <C>conpty.dll</C> next to the executable first, so putting it there is enough.</P>

      <H2 id="claude">Claude over stream-json</H2>
      <P>Claude Code has a headless mode that speaks JSON over standard input and output. Kyu starts it like this and reads events line by line:</P>
      <Pre>
        claude -p --input-format stream-json --output-format stream-json{'\n'}
        {'  '}--verbose --include-partial-messages --permission-prompt-tool stdio
      </Pre>
      <Lista>
        <li>Text arrives in chunks (<C>stream_event</C>), so the reply is written as it comes, like in the terminal.</li>
        <li>When it wants to use a tool, a <C>can_use_tool</C> request arrives with what it’s about to do. Kyu reads the file before the change, shows the diff and answers allow or deny, with a message if I want.</li>
        <li>To let it use the terminals, Kyu runs a small MCP server on <C>127.0.0.1</C> with a fresh key on every start. Reading and listing don’t ask; running a command always does.</li>
      </Lista>
      <Caja tipo="ojo" titulo="Running in a terminal you can see">When Claude runs something, it does it in a “Claude” pane that opens alongside without stealing focus. Kyu waits for the prompt, types the command, waits for the block to finish and returns the output. If I was typing in that terminal, it doesn’t overwrite it.</Caja>

      <H2 id="numeros">The numbers</H2>
      <P>I measured it against Windows Terminal on my machine (Ryzen 9 5900X) with a script that launches it, waits for the shell and reads memory:</P>
      <Tabla
        cab={['', 'Kyu', 'Windows Terminal']}
        filas={[
          ['Launch to shell', '2.6 s', '2.1 s'],
          ['Total memory', '516 MB', '213 MB'],
          ['Dumping 10.7 MB of text', '~0.45 s', '~0.45 s'],
        ]}
      />
      <P>Output speed is the same. Memory is where it loses: Kyu’s executable is 31 MB and almost everything else is WebView2, which takes over 100 MB with GPU drawing. Now, after a while without focus, Kyu asks WebView2 to release memory, hidden tabs drop their WebGL context and the Claude panel, editor and settings load only when opened. It’s the price of building the interface with web tech, and I accept it for how easy it is to make it good.</P>

      <H2 id="aprendido">What I learned</H2>
      <Lista>
        <li>A terminal is much more than drawing text: nearly all the work is at the edges (sizes, encoding, AltGr, paste, the shell exiting).</li>
        <li>On Windows, when something odd happens between the terminal and the shell, the answer is almost always ConPTY.</li>
        <li>Automated browser tests don’t see everything. Dragging tabs worked in the test and not with a real mouse, because Tauri was keeping drags for itself to accept files from Explorer.</li>
        <li>Building the tool I work with changes how I work: everything that annoyed me now has a fix.</li>
      </Lista>
      <P>The code is at <C>github.com/IsDerky/kyu-terminal</C>, with installers for Windows and Linux.</P>
      <P><Gris>And yes, a good part of Kyu was written with Claude inside Kyu.</Gris></P>
    </>
  ),
};
