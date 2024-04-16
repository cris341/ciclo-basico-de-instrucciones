const fs = require('fs');

class CicloBasicoInstrucciones{

    constructor(){
 
        this.filepath = "programa 1.txt";
        this.instructions = [];
        this.execution = "RUN"

        //variables del ciclo basico de instrucciones 
        this.memoria = [];
        this.icr = null;
        this.pc = null;
        this.mar = null;
        this.mdr = null;
        this.unidadControl = null;
        this.acumulador = 0;
        this.alu = null;
    }

   async ReadFile(){
        
        try {
            const data = await fs.promises.readFile(this.filepath, 'utf8');
            const lineas = data.split('\n').map(linea => linea.trim()).filter(linea => linea.trim() !== '');//Separa el text en un array y elimina los espacion
            this.instructions = lineas;
        } catch (error) {
            console.error('Error al leer el archivo:', error);
        }     
    }

    StartInstructions(){

        this.instructions.map((i)=>{
            //separa la instrucciones 
            const valores = i.split(" ");
            
            if (typeof this[valores[0]] === 'function') {
                 // Ejecutar la función si existe
                if(this.execution == "RUN"){
                    this[valores[0]](valores[1],valores[2],valores[3],valores[4]);
                }
               
            } else {
                // Mostrar un mensaje si la función no existe
                console.log(`La función ${valores[0]} no está definida.`);
            }
        })
    }

    //Realiza casi todo el proceso del procesador
    Procesador(typeInstructions, memory){
        this.pc = memory;
        
        //le pasamos la instruccion a MAR
        this.mar = this.pc; //El MAR que deberia hacer es buscar el tipo de instrccion que es
        
        //pasamos el tipo de instrccion al MDR 
        this.mdr = typeInstructions + this.mar;
        //pasamos el valor al ICR Y despues a la unidad de control
        this.icr = this.mdr;
        this.unidadControl = this.icr;

        //le pasamos el espacio de memoria de la instruccio al MAR 
        this.mar = memory;
        if(typeInstructions == "STORE"){
            this.mdr = this.acumulador;

            this.memoria.forEach(element => {
                if(this.mar in element){
                    element[this.mar] = this.mdr;
                }
            });
        }else{

        }
        //ahora buscamos en la memoria el valor que esta en el mar y lo guardamos en el MDR
        this.mdr = this.memoria.map(objeto => objeto[this.mar]).find(valor => valor !== undefined);
    }

    //Realiza casi todo el proceso del procesador
    Procesador(typeInstructions, memory){
        this.pc = memory;
        
        //le pasamos la instruccion a MAR
        this.mar = this.pc; //El MAR que deberia hacer es buscar el tipo de instrccion que es
        
        //pasamos el tipo de instrccion al MDR 
        this.mdr = typeInstructions +" "+ this.mar;
        //pasamos el valor al ICR Y despues a la unidad de control
        this.icr = this.mdr;
        this.unidadControl = this.icr;

        //le pasamos el espacio de memoria de la instruccio al MAR 
        this.mar = memory;
        if(typeInstructions == "STORE"){
            this.mdr = this.acumulador;

            this.memoria.forEach(element => {
                if(this.mar in element){
                    element[this.mar] = this.mdr;
                }
            });
        }else{
            //ahora buscamos en la memoria el valor que esta en el mar y lo guardamos en el MDR
            this.mdr = this.memoria.map(objeto => objeto[this.mar]).find(valor => valor !== undefined);
        }

    }

    SET(memory,value) {

        const existe = this.memoria.some(item => Object.keys(item)[0] === memory);
        if (!existe) {
            this.memoria.push({[memory]:value})
        }else{
            console.log("El espacio de memoria ya existe");
        }
    }

    LDR(memory) {
        this.Procesador("LOAD",memory)
        //por ultimo se lo pasamos al acumulador 
        this.acumulador = this.mdr; 
    }

    ADD(memoryOne,memoryTwo, memoryTree ) {

        if(memoryTwo == "NULL" && memoryTree =="NULL"){

            this.Procesador("ADD",memoryOne)
            this.alu = this.acumulador;
            this.acumulador = this.mdr;

            this.acumulador =  parseInt(this.alu) + parseInt(this.acumulador);
            
        }else{

            //carga el valor de la primera memoria 
            this.Procesador("ADD",memoryOne)
            this.acumulador = this.mdr;
            this.alu = this.acumulador;
            //carga el segundo valor del otro espacio de memoria
            this.Procesador("ADD",memoryTwo)
            this.acumulador = this.mdr;

            //suma los dos valores y los almacena en el acumulador
            this.acumulador = parseInt(this.acumulador) + parseInt(this.alu);

            if(memoryTree != "NULL"){
                //memoryTree DIFERENTE A NULL GUARDAMOS el valor del acumulador en la memoryTree
                this.STR(memoryTree);
            }
        }
    
    }

    INC(memory) {
        this.Procesador("INCREMENT",memory);

        this.acumulador = parseInt(this.mdr) +1 ; 
    }

    DEC(memory) {
        this.Procesador("DECREMENT",memory);

        this.acumulador = parseInt(this.mdr) -1; 
    }

    STR(memory) {

        this.Procesador("STORE",memory);
    }

    SHW(instruccion) {       
        switch (instruccion) {
            case "ACC":
                console.log("El acumulador es: "+ this.acumulador);
                break;

            case "ICR":
                console.log("El ICR es: "+ this.icr);
                break;
                
            case "MAR":
                console.log("El MAR es: "+ this.mar);

                break;
            case "MDR":
                console.log("El MDR es: "+ this.mdr);

                break;
            case "UC":
                console.log("El unidad de control es: "+ this.unidadControl);

                break;
            default:
                const existe = this.memoria.some(item => Object.keys(item)[0] === instruccion);
                if(existe){
                    let valor = this.memoria.map(objeto => objeto[instruccion]).find(valor => valor !== undefined)
                    console.log(`El valor en el espacio de memoria ${instruccion} es ${valor}`);
                }else{
                    console.log("la intruccion no es valida");
                }          
                break;
        }
    }

    PAUSE() {
        this.execution = "PAUSE";
        console.log("Ciclo de instrucción pausa");
    }

    END() {

        //limpia el procesador 
        this.icr = null;
        this.pc = null;
        this.mar = null;
        this.mdr = null;
        this.unidadControl = null;
        this.acumulador = 0;
        this.alu = null;

        this.execution = "END";
        console.log("Ciclo de instrucción FINALIZADO");
    }

}

const cicloBasicoInstrucciones = new CicloBasicoInstrucciones();
cicloBasicoInstrucciones.ReadFile()
.then(()=>cicloBasicoInstrucciones.StartInstructions());