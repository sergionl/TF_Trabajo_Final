<center><h1>Trabajo Final - Informe </h1></center>

<div style="width: 100%; clear: both;">
	<div style="float: left; width: 30%;">
		<img src="img/upc.png", align="left">
		<p style="margin: 0; text-align:center;"><b>Universidad Peruana de Ciencias Aplicadas (UPC)</b></p>
	</div>
	<div style="float: right; width: 70%;">
		<p style="margin: 0; padding-top: 22px; text-align:center;">Computación Grafica</p>
		<p style="margin: 0; text-align:center;">Prof. : <b>Luis Martin Canaval Sanchez Silva</b></p>
		<p>&nbsp;</p> 
		<p style="margin: 0; text-align:center; padding-button: 100px;">Alumnos: <b>	
			<br/>*	Nuñez Lazo, Sergio Antonio · U201910357
		</b></p>
		<p style="margin: 0; text-align:center;">Ciencias de la Computación</p>
		<p style="margin: 0; text-align:center;">2022-01</p>
	</div>
</div>

<div style="width:100%;height=100%;">&nbsp;</div>

## Introducción

El trabajo presentado es una mejora al proyecto presentado en el trabajo parcial. Para este trabajo se pidió la implementación de distintos tipos de iluminación e instanciamiento.

## Objetivos

 - Modificar el código del trabajo parcial con el objetivo de añadir
   luces ambientales, especulares y difusas
 - Modificar la forma de carga de objetos, para este trabajo fue
   requisito el uso de modelos wavefront
 - Usar instanciamiento para 50000 o más instancias
 - Configurar el manejo de la cámara usando teclado

## Problema/ Caso desarrollado

El proyecto que se uso como base generaba un terreno procedural infinito, además de tener texturas. En ese proyecto también había objetos que se movían en el eje Y, además estos objetos tenían colisión simple. Como ya se menciono en el presente trabajo se modificó este proyecto para agregar todas las mejoras que liste en la sección de objetivos del trabajo.

## Descripción de la solución propuesta

Para este problema me apoye en la librería cg.ts que el profesor creo durante el proceso del ciclo académico, esta fue útil para la implementación de la cámara y del movimiento. En este proyecto use las instancias para poder generar el terreno, ya que esto ayuda a poder dibujar varios objetos sin gastar muchos recursos, esta mejora permitió generar un terreno más grande. Se utilizaron los shaders usados en la clase de la semana 14 para poder implementar las luces. Finalmente, no tuve que realizar cambios a la carga de objetos, ya que en el proyecto que usé como base ya había hecho uso de modelos wavefront.

## Desarrollo (incluir pantallazos y código de las principales funciones)

<div><center>
	<img src="img/Instancias.png">
</center></div>

Creación de instancias para el terreno

<div><center>
	<img src="img/Wavefront.png">
</center></div>

Carga de objetos usando wavefront

<div><center>
	<img src="img/Dibujo.png">
</center></div>

Dibujo haciendo uso de instancias

## Conclusiones

Concluyo que este trabajo me ayudo de poner en practica los conocimientos aprendidos durante todo el ciclo, especialmente durante la segunda mitad del curso. Además, este trabajo me propuso el reto adicional de tener que ir cambiando un proyecto ya existente con el objetivo de mejorarlo.

## Anexos

Link Repositorio: https://github.com/sergionl/TF_Trabajo_Final

Link del video:
https://www.youtube.com/watch?v=0rwWL7kpOYw
