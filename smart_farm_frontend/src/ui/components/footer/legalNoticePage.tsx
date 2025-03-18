// src/components/LegalNoticePage.tsx
import React from 'react';
import { Container, Title, Text, Stack, Anchor, List } from '@mantine/core';

const LegalNoticePage: React.FC = () => {
    return (
        <Container size="md" mt="xl" style={{ overflowX: 'hidden' }}>
            <Stack style={{ overflowX: 'hidden' }} gap="md">
                <Title order={1}>Impressum</Title>

                <Title order={2}>Herausgeber</Title>
                <Text>Das Präsidium der TU Clausthal</Text>
                <Text>Technische Universität Clausthal</Text>
                <Text>Adolph-Roemer-Straße 2a</Text>
                <Text>38678 Clausthal-Zellerfeld</Text>
                <Text>Telefon: +49 5323 72-0</Text>
                <Text>Telefax: +49 5323 72-3500</Text>
                <Text>
                    E-Mail:{' '}
                    <Anchor href="mailto:info@tu-clausthal.de">info@tu-clausthal.de</Anchor>
                </Text>
                <Text>
                    Internet:{' '}
                    <Anchor href="http://www.tu-clausthal.de" target="_blank" rel="noopener noreferrer">
                        www.tu-clausthal.de
                    </Anchor>
                </Text>
                <Text>USt-ID: DE811282802</Text>

                <Title order={2}>Zuständige Aufsichtsbehörde</Title>
                <Text>
                    Niedersächsisches Ministerium für Wissenschaft und Kultur, Leibnizufer 9, 30169
                    Hannover
                </Text>
                <Text>
                    <Anchor href="http://www.mwk.niedersachsen.de" target="_blank" rel="noopener noreferrer">
                        www.mwk.niedersachsen.de
                    </Anchor>
                </Text>

                <Title order={2}>Web-Redaktion</Title>
                <Text>
                    Bei Fragen, Anregungen und Kommentaren zum zentralen Web-Angebot (
                    <Anchor href="http://www.tu-clausthal.de" target="_blank" rel="noopener noreferrer">
                        www.tu-clausthal.de
                    </Anchor>
                    ) der TU Clausthal wende dich bitte an{' '}
                    <Anchor href="mailto:webmaster@tu-clausthal.de">webmaster@tu-clausthal.de</Anchor>.
                </Text>
                <Text>
                    Anfragen zu den Inhalten der Internetseiten der einzelnen Einrichtungen und Institute der TU
                    Clausthal richte bitte an die Webmaster der jeweiligen Einrichtung (siehe "Kontakt"-Link
                    ganz unten auf der jeweiligen Seite).
                </Text>

                <Title order={2}>Name und Anschrift des Verantwortlichen</Title>
                <Text>
                    Der Verantwortliche im Sinne der Datenschutzgrundverordnung (DSGVO) und anderer nationaler
                    Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen
                    ist die:
                </Text>
                <Text>Technische Universität Clausthal</Text>
                <Text>Adolph-Roemer-Straße 2a</Text>
                <Text>D-38678 Clausthal-Zellerfeld</Text>
                <Text>Telefon: +49 5323 72-0</Text>
                <Text>Fax: +49 5323 72-3500</Text>
                <Text>
                    Website:{' '}
                    <Anchor href="http://www.tu-clausthal.de" target="_blank" rel="noopener noreferrer">
                        www.tu-clausthal.de
                    </Anchor>
                </Text>
                <Text>
                    Impressum:{' '}
                    <Anchor
                        href="http://www.tu-clausthal.de/impressum/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        www.tu-clausthal.de/impressum/
                    </Anchor>
                </Text>
                <Text>
                    Die Technische Universität Clausthal ist eine Körperschaft des öffentlichen Rechts und wird
                    durch den Präsidenten gesetzlich vertreten.
                </Text>
                <Text>
                    Die zuständige Aufsichtsbehörde ist: Die Landesbeauftragte für den Datenschutz Niedersachsen,
                    Prinzenstraße 5, 30159 Hannover, Telefon: +49 511 120-4500, Fax: +49 511 120-4599, E-Mail:{' '}
                    <Anchor href="mailto:poststelle@lfd.niedersachsen.de">poststelle@lfd.niedersachsen.de</Anchor>
                </Text>

                <Title order={2}>Datenschutzbeauftragter</Title>
                <Text>Behördlicher Datenschutzbeauftragter der Technischen Universität Clausthal:</Text>
                <Text>Technische Universität Clausthal - Der Datenschutzbeauftragte -</Text>
                <Text>Herr Andreas Tews, M.A.</Text>
                <Text>Adolph-Roemer-Straße 2A</Text>
                <Text>D-38678 Clausthal-Zellerfeld</Text>
                <Text>
                    E-Mail:{' '}
                    <Anchor href="mailto:dsb@tu-clausthal.de">dsb@tu-clausthal.de</Anchor>
                </Text>
                <Text>
                    Webseite:{' '}
                    <Anchor
                        href="https://www.datenschutz.tu-clausthal.de/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://www.datenschutz.tu-clausthal.de/
                    </Anchor>
                </Text>

                <Title order={2}>Allgemeines zur Datenverarbeitung</Title>
                <Text>
                    Die Technische Universität Clausthal verarbeitet personenbezogene Daten der Website-Nutzer
                    grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
                    von deren Inhalten und Diensten erforderlich ist. Die Verarbeitung personenbezogener Daten
                    erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen,
                    in denen eine vorherige Einwilligung aus tatsächlichen Gründen nicht möglich ist und die
                    Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.
                </Text>

                <Title order={2}>Rechtsgrundlage für die Verarbeitung personenbezogener Daten</Title>
                <Text>
                    Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der betroffenen
                    Person einholen, dient Art. 6 Abs. 1 lit. a DSGVO als Rechtsgrundlage.
                </Text>
                <Text>
                    Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages, dessen
                    Vertragspartei die betroffene Person ist, erforderlich ist, dient Art. 6 Abs. 1 lit. b
                    DSGVO als Rechtsgrundlage. Dies gilt auch für Verarbeitungsvorgänge, die zur Durchführung
                    vorvertraglicher Maßnahmen erforderlich sind.
                </Text>
                <Text>
                    Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen
                    Verpflichtung erforderlich ist, der unser Unternehmen unterliegt, dient Art. 6 Abs. 1 lit.
                    c DSGVO als Rechtsgrundlage.
                </Text>
                <Text>
                    Für den Fall, dass lebenswichtige Interessen der betroffenen Person oder einer anderen
                    natürlichen Person eine Verarbeitung personenbezogener Daten erforderlich machen, dient Art.
                    6 Abs. 1 lit. d DSGVO als Rechtsgrundlage.
                </Text>
                <Text>
                    Ist die Verarbeitung zur Wahrnehmung einer Aufgabe erforderlich, die im öffentlichen
                    Interesse liegt oder in Ausübung öffentlicher Gewalt erfolgt, die dem Verantwortlichen
                    übertragen wurde, ist die Rechtsgrundlage Art. 6 Abs. 1 lit. e DSGVO i. V. m. § 3
                    Niedersächsisches Datenschutzgesetz (NDSG).
                </Text>

                <Title order={2}>Webseiten der TU Clausthal</Title>
                <Title order={3}>Art und Umfang der erfassten Daten</Title>
                <List>
                    <List.Item>IP-Adresse des Rechners des Nutzers</List.Item>
                    <List.Item>
                        Informationen über den Browsertyp und die verwendete Version
                    </List.Item>
                    <List.Item>
                        Das Betriebssystem (Bezeichnung und Version) des Nutzers
                    </List.Item>
                    <List.Item>Datum und Uhrzeit des Zugriffs</List.Item>
                    <List.Item>Ausgangs-Webseite (Referrer)</List.Item>
                    <List.Item>Dokumente, die vom System des Nutzers abgerufen werden</List.Item>
                </List>
                <Text>
                    Die Daten werden ebenfalls in den Logfiles unserer Systeme gespeichert. Eine Speicherung
                    dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers findet nicht statt.
                    Die Speicherung erfolgt am Standort der Technischen Universität Clausthal in
                    Clausthal-Zellerfeld ausschließlich auf eigener Infrastruktur.
                </Text>

                <Title order={2}>Rechtsgrundlage für die vorübergehende Speicherung der Daten</Title>
                <Text>
                    Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine
                    Auslieferung angeforderter Dokumente an den Rechner des Nutzers zu ermöglichen. Hierfür
                    muss die IP-Adresse des Nutzers für die Dauer der Sitzung gespeichert bleiben.
                </Text>
                <Text>
                    Die Speicherung in Logfiles erfolgt, um die Funktionsfähigkeit der Website
                    sicherzustellen. Zudem dienen die Daten der Optimierung der Website und zur Sicherstellung
                    der Sicherheit der informationstechnischen Systeme. Eine Auswertung der Daten zu
                    Marketingzwecken findet nicht statt.
                </Text>
                <Text>
                    Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht
                    mehr erforderlich sind. Im Falle der Erfassung der Daten zur Bereitstellung der Website ist
                    dies der Fall, wenn die jeweilige Sitzung beendet ist. Im Falle der Speicherung der Daten
                    in Logfiles erfolgt dies in der Regel nach sieben Tagen. Eine längere Speicherung ist nur
                    bei technischen und rechtlichen Zwecken vorgesehen.
                </Text>

                <Title order={2}>Widerspruchsmöglichkeit</Title>
                <Text>
                    Die Erfassung der Daten zur Bereitstellung der Website und die Speicherung der Daten in
                    Logfiles ist für den Betrieb der Internetseite zwingend erforderlich. Es besteht
                    folglich seitens des Nutzers keine Widerspruchsmöglichkeit.
                </Text>

                <Title order={2}>Webanalyse durch interne Systeme oder externe Anbieter / Nutzung von Cookies</Title>
                <Text>
                    Auf den Webseiten der TU Clausthal wird die Webanalyse-Software Matomo (ehemals:
                    „PIWIK“) des Anbieters InnoCraft Ltd. eingesetzt. Das Programm wird auf eigenen
                    Servern der TU Clausthal betrieben, sodass die erhobenen Analysedaten nicht an Dritte
                    weitergegeben werden. Das berechtigte Interesse der TU Clausthal liegt in der Analyse und
                    Optimierung ihres Internetauftritts und in Marketingzwecken. Rechtsgrundlage hierzu ist Art.
                    6 Abs. 1 lit. e DSGVO i. V. m. § 3 NDSG. Die Software sammelt und wertet unter anderem
                    folgende Daten aus:
                </Text>
                <List>
                    <List.Item>IP-Adresse (anonymisiert)</List.Item>
                    <List.Item>Cookie zur Unterscheidung verschiedener Besucher</List.Item>
                    <List.Item>Zuvor besuchte URL (Referrer)</List.Item>
                    <List.Item>Name und Version des Betriebssystems</List.Item>
                    <List.Item>
                        Name, Version und Spracheinstellung des Browsers
                    </List.Item>
                </List>
                <Text>
                    Falls JavaScript aktiviert ist, werden zusätzlich erfasst:
                </Text>
                <List>
                    <List.Item>Besuchte URLs auf dieser Webseite</List.Item>
                    <List.Item>Zeitpunkte der Seitenaufrufe</List.Item>
                    <List.Item>Bildschirmauflösung und Farbtiefe</List.Item>
                    <List.Item>Vom Browser unterstützte Techniken und Formate</List.Item>
                </List>
                <Text>
                    Im Sinne der Datensparsamkeit wird eine automatische Anonymisierungsfunktion ausgeführt,
                    welche die IP-Adresse um zwei Byte kürzt. Eine Zuordnung zwischen dem Nutzerprofil und
                    Ihnen ist nicht möglich.
                </Text>
                <Text>
                    Zur Erfassung der Daten speichert Matomo ein Cookie auf Ihrem Endgerät, welches 6 Monate
                    lang gültig ist. Falls Sie mit dieser Verarbeitung nicht einverstanden sind, können Sie
                    die Speicherung des Cookies durch eine entsprechende Einstellung in Ihrem Browser
                    verhindern.
                </Text>

                <Title order={2}>ReadSpeaker</Title>
                <Text>
                    ReadSpeaker ist ein Lesedienst für Internetinhalte. Bei Klick auf die Schaltfläche
                    "Vorlesen" wird der entsprechende Text über die IP des Benutzers an den
                    ReadSpeaker-Server übertragen, wo die Audiodatei während des Streaming-Vorgangs
                    generiert und an die IP des Benutzers zurückgesendet wird. Nach der Übermittlung werden
                    der Prozess und die IP-Adresse des Benutzers sofort gelöscht. ReadSpeaker sammelt oder
                    speichert keine personenbezogenen Daten. Alle Dienste werden in Europa (Schweden)
                    implementiert. Bei Verwendung der ReadSpeaker-Funktion werden technische Cookies auf dem
                    Endgerät gespeichert, um die vom Benutzer ausgewählten Einstellungen beizubehalten.
                    Diese Cookies werden nach der Sitzung oder, abhängig von der gewählten Funktion, maximal
                    für 30 Tage gespeichert. Rechtsgrundlage für die Nutzung von ReadSpeaker ist Ihre
                    Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO.
                </Text>

                <Title order={2}>Soziale Medien und externe Werbung</Title>
                <Text>
                    Es werden keine Code-Elemente von Anbietern sozialer Medien verwendet, die das direkte
                    Teilen von Inhalten ermöglichen, weshalb keinerlei Aufrufinformationen an solche Anbieter
                    übermittelt werden.
                </Text>
                <Text>
                    Auf den Webseiten der TU Clausthal wird generell keine Werbung geschaltet, und es erfolgt
                    keine Weitergabe von Aufrufinformationen an externe Anbieter.
                </Text>

                <Title order={2}>Unsere Social–Media–Auftritte</Title>
                <Text>
                    Wir unterhalten öffentlich zugängliche Profile in sozialen Netzwerken. Im Folgenden
                    finden Sie Informationen zu den einzelnen Netzwerken:
                </Text>
                <Title order={3}>Facebook</Title>
                <Text>
                    Wir verfügen über ein Profil bei Facebook. Anbieter ist die Facebook Ireland Limited,
                    4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. Die erfassten Daten werden
                    nach Aussage von Facebook auch in die USA und andere Drittländer übertragen. Es besteht
                    eine Vereinbarung über gemeinsame Verarbeitung (Controller Addendum) mit Facebook. Sie
                    können Ihre Werbeeinstellungen in Ihrem Nutzer-Account anpassen unter{' '}
                    <Anchor
                        href="https://www.facebook.com/settings?tab=ads"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://www.facebook.com/settings?tab=ads
                    </Anchor>
                    . Die Datenübertragung in die USA stützt sich auf die Standardvertragsklauseln der EU-Kommission.
                </Text>
                <Title order={3}>Twitter</Title>
                <Text>
                    Wir nutzen den Kurznachrichtendienst Twitter. Anbieter ist die Twitter International
                    Company, One Cumberland Place, Fenian Street, Dublin 2, D02 AX07, Irland. Sie können Ihre
                    Datenschutzeinstellungen in Ihrem Twitter-Account anpassen unter{' '}
                    <Anchor
                        href="https://twitter.com/personalization"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://twitter.com/personalization
                    </Anchor>
                    . Die Datenübertragung in die USA erfolgt auf Basis der Standardvertragsklauseln der EU-Kommission.
                </Text>
                <Title order={3}>Instagram</Title>
                <Text>
                    Wir verfügen über ein Profil bei Instagram. Anbieter ist die Instagram Inc., 1601 Willow
                    Road, Menlo Park, CA, 94025, USA. Die Datenübertragung in die USA stützt sich auf die
                    Standardvertragsklauseln der EU-Kommission. Details entnehmen Sie der Datenschutzerklärung
                    von Instagram.
                </Text>
                <Title order={3}>XING</Title>
                <Text>
                    Wir verfügen über ein Profil bei XING. Anbieter ist die New Work SE, Dammtorstraße 30,
                    20354 Hamburg, Deutschland. Details entnehmen Sie der Datenschutzerklärung von XING.
                </Text>
                <Title order={3}>LinkedIn</Title>
                <Text>
                    Wir verfügen über ein Profil bei LinkedIn. Anbieter ist die LinkedIn Ireland Unlimited
                    Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. LinkedIn verwendet Werbecookies.
                    Zum Deaktivieren von LinkedIn-Werbe-Cookies nutzen Sie bitte{' '}
                    <Anchor
                        href="https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        diesen Link
                    </Anchor>
                    . Die Datenübertragung in die USA erfolgt auf Basis der Standardvertragsklauseln der EU-Kommission.
                </Text>
                <Title order={3}>YouTube</Title>
                <Text>
                    Wir verfügen über ein Profil bei YouTube. Anbieter ist die Google Ireland Limited, Gordon
                    House, Barrow Street, Dublin 4, Irland. Details entnehmen Sie der Datenschutzerklärung
                    von YouTube.
                </Text>

                <Title order={2}>E-Mail-Kontakt und Kontaktformulare</Title>
                <Text>
                    Auf unserer Internetseite ist ein Kontaktformular vorhanden, das für die elektronische
                    Kontaktaufnahme genutzt werden kann. Die in der Eingabemaske eingegebenen Daten werden an
                    uns übermittelt und gespeichert. Alternativ kann per E-Mail Kontakt aufgenommen werden. In
                    diesem Fall werden die übermittelten personenbezogenen Daten gespeichert und ausschließlich
                    zur Bearbeitung der Konversation verwendet. Rechtsgrundlage für die Verarbeitung der Daten
                    ist, sofern eine Einwilligung vorliegt, Art. 6 Abs. 1 lit. a DSGVO oder im Falle eines
                    Vertragsabschlusses Art. 6 Abs. 1 lit. b DSGVO.
                </Text>
                <Text>
                    Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung nicht
                    mehr erforderlich sind. Für Daten aus dem Kontaktformular gilt dies, sobald die jeweilige
                    Konversation beendet ist.
                </Text>

                <Title order={2}>Institute und Einrichtungen</Title>
                <Text>
                    Sofern auf den Webseiten einzelner Institute und Einrichtungen der TU Clausthal persönliche
                    oder geschäftliche Daten eingegeben werden (z. B. E-Mail-Adressen, Namen, Anschriften),
                    erfolgt die Preisgabe dieser Daten auf freiwilliger Basis. Die Verarbeitung erfolgt nur für
                    den im jeweiligen Onlineformular genannten Zweck und eine Preis- oder Weitergabe an Dritte
                    findet nicht statt.
                </Text>

                <Title order={2}>Veranstaltungen</Title>
                <Text>
                    Mit der Anmeldung zu einer Veranstaltung der TU Clausthal erklären Sie sich mit der
                    Erhebung, Speicherung und Nutzung der vorstehenden personenbezogenen Daten zum Zwecke der
                    Veranstaltung einverstanden. Dies umfasst die Registrierung, die Erstellung einer
                    Teilnehmerliste sowie ggf. das Ausstellen einer Teilnahmebescheinigung. Mit der Anmeldung
                    stimmen Sie zu, dass die personenbezogenen Daten an Dritte weitergegeben werden dürfen,
                    sofern diese mit der Durchführung der Veranstaltung beauftragt sind. Die Technische
                    Universität Clausthal stellt sicher, dass die Rechte des Teilnehmers gewahrt werden. Die
                    E-Mail-Adresse kann ausschließlich für den Versand von Einladungen und Informationsmaterial
                    genutzt werden. Diese Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden.
                </Text>

                <Title order={2}>Rechte betroffener Personen</Title>
                <Text>
                    Werden Ihre personenbezogene Daten verarbeitet, stehen Ihnen folgende Rechte zu:
                </Text>
                <List>
                    <List.Item>Auskunftsrecht gemäß Art. 15 DSGVO</List.Item>
                    <List.Item>Recht auf Berichtigung gemäß Art. 16 DSGVO</List.Item>
                    <List.Item>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO</List.Item>
                    <List.Item>Recht auf Löschung gemäß Art. 17 DSGVO</List.Item>
                    <List.Item>Recht auf Unterrichtung gemäß Art. 19 DSGVO</List.Item>
                    <List.Item>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO</List.Item>
                    <List.Item>Widerspruchsrecht gemäß Art. 21 DSGVO</List.Item>
                    <List.Item>
                        Recht auf Widerruf der datenschutzrechtlichen Einwilligungserklärung gemäß Art. 7 Abs. 3 DSGVO
                    </List.Item>
                    <List.Item>
                        Recht, keiner ausschließlich auf automatisierter Verarbeitung beruhenden Entscheidung gemäß Art. 22 DSGVO unterworfen zu werden
                    </List.Item>
                </List>
                <Text>
                    Zur Ausübung dieser Rechte wenden Sie sich bitte an die im Impressum angegebenen Kontaktdaten.
                </Text>

                <Title order={2}>Recht auf Beschwerde bei einer Aufsichtsbehörde</Title>
                <Text>
                    Unbeschadet anderer verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe steht Ihnen das
                    Recht zu, bei einer Aufsichtsbehörde Beschwerde einzulegen, wenn Sie der Ansicht sind, dass
                    die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.
                </Text>
            </Stack>
        </Container>
    );
};

export default LegalNoticePage;
