# Conanwiki Connection Status

    Dieses Plugin zeigt den Status von Conanwiki Mitgliedern an, in dem Sinne, in dem man es in dem Connected Tab findet, es werden Farben für Ränge vergeben

## Benutzen

Zum Benutzen das script "conanwiki.plugin.js" im release Ordner zu den [Better Discord](https://betterdiscord.app/) Plugins hinzufügen, für das Plugin wird die [BDPluginLibrary](https://github.com/rauenzi/BDPluginLibrary) benötigt, diese wird allerdings durch das script automatisch heruntergeladen, falls nicht vorhanden.

## Develop

```bash 
npm i 
```

 Dann in examples/conanwiki/ bearbeiten und die Ordner im package.json beim script "conanwiki" so anpassen, sodass das script in den Better Discord Plugins Ordner kopiert wird, Better discord reloadet automatisch:

```bash 
npm run conanwiki
 ```

oder zum ständigen aktualisieren

```bash 
npm run dev
```
