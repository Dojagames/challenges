# CodinGame Labyrinth

## Gedanken dazu:

Da ich mit dem letzten Code nicht den kürzesten Weg garantieren konnte, war mein erster Ansatz, dass ich als erstes das ganze Labyrinth ablaufe, um so danach garantiert den kürzesten Weg finde. 

Dafür habe ich mir überlegt, dass ich bei jeder besuchten Zelle ein Array anlege um so die Nachbarzellen zu speichern, welche betretbar sind und noch nicht besucht wurden.

Dann lauf ich alle besuchbaren Nachbarn ab, bis ich in einer Sackgasse bin, dann lauf ich zurück um diesen Schritt von der nächsten Zelle zu wiederholen.

Das ganze mach ich solange, bis entweder das ganze Labyrinth aufgedeckt ist oder alle Wege abgelaufen wurden.


Wenn das ganze Labyrinth aufgedeckt ist nutze ich BFS um den kürzesten Weg zum Kontrollraum und dann zurück zum Start zu finden. 


### Was noch zu verbessern ist:
Ich könnte von Anfang an BFS nutzen, da sich dadurch die benachbarten Zellen aufdecken, während ich das Labyrinth ablaufe.

Warum habe ich das nicht gemacht? ich habe eine Art DFS benutzt um so weniger Treibstoff zu verbrauchen um garantieren zu koennen, dass der Treibstoff reicht.


