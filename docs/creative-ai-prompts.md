# Rhön Park Luxury Line - Creative AI Prompts

## Zweck

Dieses Dokument beschreibt die visuelle Richtung für künftige AI-generierte Assets der Rhön Park Luxury Line. Es ist ein Prompt- und Asset-Registry-System für den aktuellen Landingpage-Entwurf. Es ruft keine AI-Tools automatisch auf und ersetzt keine finale Bildrechte-, Marken- oder Rechtsprüfung.

## Visuelle Leitplanken

- Stimmung: ruhig, hochwertig, regional verwurzelt, naturverbunden, nicht protzig.
- Bildsprache: Editorial Luxury, tiefer Wald, klare Morgenluft, warme Innenräume, feine Materialien, echte Nutzungsmomente.
- Farbwelt: tiefes Tannengrün, Ivory, Champagne-Akzente, Wine nur sparsam für CTA- oder Service-Signale.
- Komposition: viel negative Fläche, lange Linien, Fensterblicke, natürliche Texturen, menschliche Spuren ohne generische Stock-Posen.
- Keine austauschbaren Spa-/Hotel-Floskeln: Rhön, Naturraum, Ruhe und private Resort-Schicht müssen erkennbar bleiben.

## Negative Prompts

Keine Fake-Hotel-Logos, keine falschen Rhön-Park-Schilder, keine identifizierbaren echten Gäste, keine übertriebenen Glitzer-/Goldflächen, keine urbanen Skyscraper-Luxury-Szenen, keine futuristischen Villen, keine tropischen Pools, keine unrealistischen Alpen- oder Schneeluxus-Klischees, keine Menschenmassen, keine Comic-Ästhetik, keine unrealistischen Zimmergrößen, keine sichtbaren Logos fremder Marken, keine erfundenen operativen Claims im Bild, kein fertig gebautes Chalet Village ohne klare Konzeptkennzeichnung.

## Einsatz in der Landingpage

- Hero: großflächiges Konzeptvisual oder später ein ruhiger Hero-Loop für die geplanten Private Chalets.
- Suiten & Chalets: ergänzende Konzeptbilder für Chalet-Details, nie als bereits bestehende Anlage darstellen.
- Executive Retreats: hochwertige Breakout- oder Boardroom-Stimmung als Ergänzung zum echten Rhön-Park-Tagungsfoto.
- Premium Family Residence: ruhige Familien- und Apartmentmomente, ohne Stock-Familienklischee.
- Wellness/Nature Reset: ruhige Wasser-, Wald- und Morgenlichtmomente als unterstützende Atmosphäre.

## Asset-Priorität

1. Hero-Film oder Hero-Still für die geplanten Private Chalets.
2. Chalet-Detailstill mit Terrasse, Waldkante und hochwertigem Interior-Gefühl.
3. Executive-Retreat-Breakout als Business-Ergänzung.
4. Priority-Wellness-/Nature-Reset-Motiv für die Experience-Strecke.
5. Suite-/Apartment-Detailmotive nur ergänzend, wenn echte Rhön-Park-Bilder nicht ausreichen.

## Kennzeichnung von Konzeptvisuals

Alle Visuals für geplante Chalets oder noch nicht real existierende Ausstattung müssen in UI, Dateiname oder Bildunterschrift als `Konzeptvisual`, `Konzeptvorschau` oder `geplantes Chalet-Konzept` gekennzeichnet werden. In der öffentlichen Landingpage darf kein Bild den Eindruck erzeugen, dass die Chalets bereits fertig gebaut oder buchbar sind, solange das Hotel dies nicht freigegeben hat.

## Asset Registry

| Asset | Zielpfad | Format | Status | Fallback im aktuellen Entwurf |
| --- | --- | --- | --- | --- |
| Hero-Film Chalet Village | `apps/rhoenpark-luxury/public/videos/luxury-line-hero.mp4` | H.264 MP4, 16:9, max. 8 MB | Prompt-ready, nicht generiert | Remote Konzeptvisual im Hero |
| Chalet Still | `apps/rhoenpark-luxury/public/images/concepts/private-chalet-village.jpg` | JPG/WebP, 16:9 und 4:3 | Prompt-ready, nicht generiert | Remote Konzeptvisual Chalet |
| Priority Wellness Still | `apps/rhoenpark-luxury/public/images/concepts/priority-wellness.jpg` | JPG/WebP, 4:3 | Prompt-ready, nicht generiert | Dining-/Atmosphäre-Fallback |
| Executive Retreat Still | `apps/rhoenpark-luxury/public/images/concepts/executive-retreat-breakout.jpg` | JPG/WebP, 16:9 | Prompt-ready, nicht generiert | echtes Rhön-Park-Tagungsbild |

## Image Prompts

### Hero Still - Private Chalet Village

**Ratio:** 16:9 und 21:9  
**Prompt:** Ruhiges Editorial-Luxury-Konzeptvisual eines geplanten privaten Chalet Villages am Rand eines deutschen Mittelgebirgswaldes in der Rhön bei Sonnenaufgang, feiner Nebel über Hügeln, natürliche Holz- und Glasarchitektur, warmes Licht aus den Chalets, keine sichtbaren Logos, keine Menschenmassen, viel negative Fläche für Landingpage-Typografie, hochwertig, realistisch, dezente Champagne-Lichtakzente, tiefes Tannengrün, ruhige Premium-Hotelästhetik, klar als Konzeptmotiv nutzbar.

### Chalet Detail - Private Terrace

**Ratio:** 4:3  
**Prompt:** Konzeptvisual einer privaten Terrasse eines hochwertigen Chalets im Biosphärenreservat Rhön, gedeckter Frühstückstisch, Leinenservietten, warmes Holz, Waldkante im Hintergrund, ruhige Morgenstimmung, realistische Architektur, keine alpinen Luxusklischees, keine fremden Logos, hochwertiges Hotel-Editorial.

### Signature Suite - Quiet Premium Interior

**Ratio:** 4:3  
**Prompt:** Ruhiger Premium-Suite-Innenraum mit warmem Licht, natürlichen Materialien, Blick in grüne Hügellandschaft der Rhön, zurückhaltende Eleganz, große Fenster, aufgeräumt, keine generische Stock-Hotelästhetik, kein übertriebener Glamour, realistische deutsche Resort-Suite.

### Executive Retreat - Premium Breakout

**Ratio:** 16:9  
**Prompt:** Hochwertiger Executive-Breakout-Raum in einem Naturresort in der Mitte Deutschlands, heller Meetingtisch, hochwertige Stühle, dezente Technik, Kaffee- und Wasserstation, Blick ins Grüne, ruhig und professionell, keine Messehalle, keine leeren Konferenzklischees, realistisch, warmes Tageslicht.

### Priority Wellness - Quiet Slot

**Ratio:** 4:3  
**Prompt:** Ruhiger Wellness-Moment in einem hochwertigen Resortpool, weiches Morgenlicht auf Wasseroberfläche, wenige elegante Liegen, natürliche Materialien, Tannengrün- und Ivory-Farbwelt, keine überfüllte Spa-Szene, keine tropischen Pflanzen, realistisch und zurückhaltend luxuriös.

## Video Prompts

Higgsfield oder ein vergleichbares Video-Tool darf genutzt werden, wenn der User klar ein Bild, Video, Hero-Asset oder Konzeptvisual anfordert. Niemals automatisch bei Build, Deploy, Test, Git oder reinen Code-Änderungen generieren.

### Hero Video - Sunrise Over Rhön Chalet Village

**Format:** H.264 MP4, 1920x1080, max. 8 MB, autoplay muted playsinline loop  
**Prompt:** Cinematic slow push-in over a quiet planned private chalet village concept in the Rhön hills at sunrise, light fog above forest and meadow, warm interior lights, natural wood and glass, premium German nature resort atmosphere, calm editorial luxury, no people crowds, no logos, no text, no completed-resort claim, seamless loop, stable camera, realistic lighting.

### Wellness Video - Priority Quiet Slot

**Format:** H.264 MP4, 1920x1080, max. 8 MB  
**Prompt:** Slow cinematic shot of a calm indoor resort pool in soft morning light, gentle water movement, natural materials, deep forest green and ivory atmosphere, premium quietness, no crowded spa, no text, no logos, seamless loop.

### Suite Video - Evening Interior

**Format:** H.264 MP4, 1920x1080, max. 8 MB  
**Prompt:** Warm evening light in a premium suite, soft curtains, natural wood, quiet fireplace-like glow, view toward dark green Rhön landscape, calm luxury, no people, no logos, subtle camera movement, seamless loop.

## Recht und Brand Safety

- AI-generierte Assets müssen als Konzeptmaterial geprüft werden, bevor sie in produktive Kommunikation gehen.
- Keine falschen operativen Versprechen im Bild oder Dateinamen.
- Keine Rhön-Park-Logos, Schilder oder markenähnlichen Elemente generieren, solange keine Freigabe vorliegt.
- Keine identifizierbaren realen Gäste oder Mitarbeitenden generieren.
- Keine Bildsprache verwenden, die Rhön Park wie ein alpines Ski-Luxusresort, ein urbanes Hochhaus-Hotel oder eine goldlastige Glamour-Marke wirken lässt.
- Menschen nur verwenden, wenn Model- und Nutzungsrechte eindeutig geklärt sind.
- Final verwendete Assets müssen im Repo gespeichert und mit Quelle, Prompt, Erstellungsdatum und Nutzungsstatus dokumentiert werden.
