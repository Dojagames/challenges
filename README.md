# CodinGame Labyrinth

## Gedanken dazu:

Da ich mit dem letzten nicht garantieren konnte, war mein erster Ansatz, dass ich als erstes das ganze Labyrinth ablaufe, um so danach garantiert den kuerzesten Weg finde. 

Dafuer habe ich mir ueberlegt, dass ich bei jeder besuchten Zelle ein Array speichere um so die Nachbarzellen zu speichern, welche betretbar sind und noch nicht besucht wurden.

Dann lauf ich alle besuchbaren Nachbarn ab, bis ich in einer Sackgasse bin, dann lauf ich zurueck um den naechsten Path zu entdecken.

Das ganze mach ich solange, bis entweder das ganze Labyrinth aufgedeckt ist oder es keinen neuen Path zu endecken gibt.


Von da aus laufe ich solange zurueck bis einer der benachbarten Zellen der Kontrollraum ist.

Vom Kontrollraum aus nutze ich BFS um den schnellsten Weg zurueck zum Start zu finden. 

### Was noch zu verbessern ist:
Ich koennte von anfang an BFS nutzen, da sich dadurch die benachbarten Zellen aufdecken, waerend ich das Labyrinth ablaufe.

Test Case 8 konnte nicht geloest werden, da der Kontrollraum zu keinem Zeitpunkt der Nachbar von einer abgelaufenen Zelle war -> 

Die Loesung dazu waere, BFS zu nutzen um zum Kontrollraum zu kommen.
