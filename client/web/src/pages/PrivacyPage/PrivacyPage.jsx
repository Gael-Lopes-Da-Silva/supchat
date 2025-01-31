import { useEffect, useState } from 'react';

import './PrivacyPage.css';

const PrivacyPage = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (localStorage.getItem('gui.theme')) {
            setTheme(localStorage.getItem('gui.theme'));
        }
    }, []);

    return (
        <div className={`privacy-container ${theme}`}>
            <div className="privacy-box">
                <h1>Politique de confidentialité de Supchat</h1>
                <hr />

                <h2>Date d'entrée en vigueur : 01 Janvier 2025</h2>
                <h2>Dernière mise à jour : 03 janvier 2025</h2>

                <h2>1. Introduction</h2>
                <p>Chez Supchat, nous attachons une grande importance à la protection de vos données personnelles. Nous nous engageons à respecter la confidentialité de vos informations et à traiter vos données conformément aux exigences légales en matière de protection des données, notamment le Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne.</p>
                <p>Cette politique de confidentialité a pour but de vous informer sur la manière dont nous collectons, utilisons, partageons et protégeons vos données personnelles lorsque vous utilisez notre application Supchat. Elle explique également vos droits en tant qu'utilisateur concernant vos informations personnelles et comment vous pouvez les exercer.</p>
                <p>Nous collectons des informations vous concernant uniquement dans le cadre des finalités légitimes et spécifiques définies ci-dessous. Nous ne traiterons vos données que pour les besoins strictement nécessaires à la fourniture de nos services et veillerons à ce que vos informations soient conservées en toute sécurité et ne soient utilisées que de manière transparente.</p>
                <p>En utilisant Supchat, vous acceptez que nous collections, traitions et stockions vos données personnelles conformément à cette politique de confidentialité. Nous vous encourageons à lire attentivement cette politique et à nous contacter si vous avez des questions ou des préoccupations concernant la manière dont vos données sont traitées.</p>
                <p>Conformément au RGPD, nous vous informons également que vous avez le droit d'accéder, de rectifier, de supprimer ou de restreindre le traitement de vos données personnelles, ainsi que d'exercer d'autres droits en lien avec la protection de vos informations personnelles, tels qu'expliqués dans la section dédiée ci-dessous.</p>

                <h2>2. Informations que nous collectons</h2>
                <p>Lorsque vous utilisez Supchat, nous collectons divers types d'informations afin de vous fournir une expérience optimale et de vous permettre d'utiliser nos services de manière efficace. Ces informations peuvent être collectées directement auprès de vous ou automatiquement via votre utilisation de notre application. Conformément au RGPD, nous nous engageons à ne collecter que les informations nécessaires aux finalités pour lesquelles elles sont traitées.</p>
                <p>Les types d'informations que nous collectons incluent :</p>
                <ul>
                    <li><strong>Informations personnelles :</strong> Ces informations vous permettent de créer et de gérer votre compte Supchat. Elles incluent votre nom, adresse e-mail, numéro de téléphone, et autres informations d'identification personnelle que vous fournissez volontairement lors de l'inscription ou de l'utilisation de l'application.</li>
                    <li><strong>Informations d'utilisation :</strong> Ces données concernent votre utilisation de Supchat et nous aident à améliorer l'expérience utilisateur. Elles incluent des informations sur vos interactions avec l'application, telles que les messages que vous envoyez ou recevez, vos connexions, les groupes ou canaux auxquels vous appartenez, ainsi que vos paramètres et préférences (par exemple, les notifications activées ou désactivées).</li>
                    <li><strong>Informations techniques :</strong> Nous collectons des informations techniques concernant les appareils et les environnements logiciels que vous utilisez pour accéder à Supchat. Cela inclut votre adresse IP, le type et la version du navigateur que vous utilisez, les informations relatives à votre appareil (comme son modèle, son système d'exploitation, etc.), et des données sur la manière dont vous accédez à nos services, telles que des journaux d'erreur ou des événements système. Ces données sont collectées afin d'assurer la performance et la sécurité de notre application.</li>
                </ul>
                <p>Les informations collectées peuvent être utilisées à diverses fins, telles que l'amélioration de la performance de l'application, la personnalisation de votre expérience, la communication avec vous au sujet de nouvelles fonctionnalités ou de mises à jour, et pour assurer la sécurité et la conformité de notre service avec la législation applicable.</p>
                <p>Conformément au principe de minimisation des données du RGPD, nous veillons à ne collecter que les informations strictement nécessaires à ces fins et à les conserver pendant une durée limitée, conformément aux exigences légales ou contractuelles.</p>

                <h2>3. Utilisation de vos informations</h2>
                <p>Nous utilisons vos informations personnelles de manière transparente et conforme au RGPD pour vous offrir une expérience optimale sur Supchat. Les informations collectées sont utilisées pour diverses finalités légitimes, que nous détaillons ci-dessous. Ces utilisations sont essentielles à la fourniture de nos services et à l'amélioration de l'application.</p>
                <p>Nous utilisons vos informations pour :</p>
                <ul>
                    <li><strong>Fournir, maintenir et améliorer nos services :</strong> Nous utilisons vos informations pour exploiter pleinement les fonctionnalités de Supchat, résoudre des problèmes techniques, offrir une assistance et maintenir la sécurité de l'application. Cela inclut la gestion de vos messages, connexions et interactions avec d'autres utilisateurs, ainsi que la mise à jour de l'application pour ajouter de nouvelles fonctionnalités.</li>
                    <li><strong>Personnaliser votre expérience dans Supchat :</strong> Nous utilisons vos informations pour adapter et personnaliser votre expérience sur notre plateforme. Cela peut inclure la personnalisation de l'interface, la gestion de vos préférences de notifications, et l'adaptation des contenus ou fonctionnalités proposés en fonction de vos comportements et de vos choix.</li>
                    <li><strong>Communiquer avec vous concernant des mises à jour, promotions et informations importantes :</strong> Nous pouvons utiliser vos informations pour vous envoyer des notifications concernant les mises à jour de l'application, des nouvelles fonctionnalités, des promotions ou des informations importantes relatives à notre service. Nous vous informerons toujours de toute communication marketing ou promotionnelle et vous aurez la possibilité de vous désinscrire à tout moment.</li>
                    <li><strong>Analyser l'utilisation de l'application pour améliorer ses fonctionnalités :</strong> Nous utilisons les informations d'utilisation et techniques collectées pour analyser la performance de l'application, identifier les problèmes techniques, et améliorer les fonctionnalités. Cela peut inclure l'analyse des données relatives à l'utilisation de l'application pour détecter des tendances, comprendre les besoins des utilisateurs et prioriser les mises à jour.</li>
                </ul>
                <p>Dans le respect des principes du RGPD, nous nous engageons à ne traiter vos informations personnelles que pour des finalités spécifiques, légitimes et clairement définies. Nous veillons également à ce que vos informations soient utilisées de manière proportionnée et que les traitements soient limités à ce qui est nécessaire pour atteindre ces objectifs.</p>
                <p>Nous ne traitons vos données personnelles que dans la mesure où cela est nécessaire à la fourniture de nos services et nous mettons en place des mesures appropriées pour garantir leur sécurité.</p>

                <h2>4. Partage de vos informations</h2>
                <p>Chez Supchat, nous nous engageons à ne pas vendre, échanger ou partager vos informations personnelles avec des tiers, sauf dans des circonstances spécifiques et légales. Nous respectons pleinement votre vie privée et nous nous assurons que vos données sont partagées uniquement lorsque cela est nécessaire pour fournir nos services ou en conformité avec la législation en vigueur.</p>
                <p>Nous pouvons partager vos informations dans les cas suivants :</p>
                <ul>
                    <li><strong>Si nous avons votre consentement explicite pour partager vos informations :</strong> Dans certains cas, nous pourrions avoir besoin de votre consentement pour partager vos informations avec des tiers. Ce consentement sera toujours demandé de manière claire et transparente, et vous aurez la possibilité de le retirer à tout moment.</li>
                    <li><strong>Pour répondre à des demandes légales ou pour se conformer aux lois en vigueur :</strong> Nous pourrions être amenés à partager vos informations personnelles si cela est requis par la loi ou pour répondre à une demande légale émanant d'une autorité publique (par exemple, en réponse à une ordonnance judiciaire, une enquête criminelle ou une demande d'une autorité compétente). Dans ce cas, nous nous assurons que la divulgation est limitée au strict nécessaire et que vos droits sont respectés.</li>
                    <li><strong>Pour améliorer la sécurité ou résoudre des problèmes techniques avec nos services :</strong> Nous pourrions partager vos informations avec nos prestataires de services ou partenaires techniques dans le but d'améliorer la sécurité, d'analyser des problèmes techniques ou d'assurer le bon fonctionnement de nos services. Ces tiers sont soumis à des contrats stricts et doivent respecter les lois applicables en matière de protection des données. Ils n'ont accès à vos informations que dans le cadre des services qu'ils fournissent pour Supchat.</li>
                </ul>
                <p>Dans tous les cas, nous veillons à ce que le partage de vos informations soit limité à ce qui est nécessaire pour atteindre les objectifs légitimes mentionnés ci-dessus et à ce que vos données soient protégées de manière appropriée conformément au RGPD. Lorsque cela est possible, nous mettons en place des accords de traitement des données (DPA) pour garantir que toute entité tierce avec laquelle nous partageons vos données respecte les mêmes normes de confidentialité et de sécurité que celles que nous appliquons.</p>

                <h2>5. Sécurité des informations</h2>
                <p>Chez Supchat, nous prenons très au sérieux la sécurité de vos informations personnelles. Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute altération, divulgation ou destruction accidentelle ou illicite. Ces mesures visent à garantir la confidentialité, l'intégrité et la disponibilité de vos informations personnelles.</p>
                <p>Les mesures que nous utilisons comprennent notamment :</p>
                <ul>
                    <li><strong>Cryptage des données :</strong> Nous utilisons des technologies de cryptage modernes pour protéger vos informations pendant leur transmission, en particulier pour les communications sensibles comme les messages et autres données personnelles.</li>
                    <li><strong>Contrôles d'accès :</strong> L'accès à vos informations est strictement limité aux employés et prestataires de services ayant besoin de ces informations pour accomplir leurs fonctions. Nous avons mis en place des systèmes d'authentification et de contrôle des accès pour garantir que seules les personnes autorisées puissent consulter ou modifier vos données.</li>
                    <li><strong>Sauvegardes régulières :</strong> Nous effectuons régulièrement des sauvegardes de vos données afin de minimiser les risques de perte ou d'altération de celles-ci en cas d'incident technique ou de catastrophe naturelle.</li>
                    <li><strong>Surveillance continue :</strong> Nous surveillons en permanence nos systèmes pour détecter toute activité suspecte ou toute violation de sécurité, afin de réagir rapidement à toute menace potentielle.</li>
                </ul>
                <p>Cependant, bien que nous mettions en œuvre des mesures de sécurité robustes, il est important de noter qu'aucune méthode de transmission de données sur Internet ou de stockage électronique n'est totalement sécurisée. En conséquence, nous ne pouvons pas garantir la sécurité absolue de vos informations personnelles. Nous vous encourageons également à prendre des précautions pour protéger vos informations personnelles, notamment en choisissant des mots de passe forts et en évitant de partager vos informations d'identification avec d'autres.</p>
                <p>En cas de violation de la sécurité des données, nous nous engageons à vous informer rapidement conformément aux obligations prévues par le RGPD, et à prendre les mesures nécessaires pour limiter l'impact de cette violation.</p>
                <p>En utilisant Supchat, vous reconnaissez que, malgré nos efforts pour protéger vos informations, il existe toujours un risque résiduel lié à la sécurité sur Internet.</p>

                <h2>6. Vos droits</h2>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez de plusieurs droits concernant vos informations personnelles. Ces droits vous permettent de mieux contrôler la manière dont vos données sont collectées, utilisées et partagées par Supchat. Nous nous engageons à respecter vos droits et à vous fournir les moyens d'exercer ces derniers de manière simple et transparente.</p>
                <p>Vous avez les droits suivants concernant vos informations personnelles :</p>
                <ul>
                    <li><strong>Accéder à vos informations personnelles que nous détenons :</strong> Vous avez le droit de demander une copie des informations personnelles que nous détenons à votre sujet. Nous vous fournirons ces informations dans un format compréhensible et lisible, sous réserve de certaines exceptions prévues par la loi.</li>
                    <li><strong>Demander la correction ou la suppression de vos informations personnelles :</strong> Si vos informations personnelles sont inexactes ou incomplètes, vous avez le droit de demander leur correction. Vous pouvez également demander la suppression de vos informations personnelles dans certaines situations, par exemple si les données ne sont plus nécessaires aux fins pour lesquelles elles ont été collectées ou si vous retirez votre consentement (lorsque le traitement est basé sur ce consentement).</li>
                    <li><strong>Vous opposer à l'utilisation de vos informations pour certaines finalités :</strong> Vous avez le droit de vous opposer à l'utilisation de vos informations personnelles dans certains cas, comme le traitement à des fins de marketing direct ou lorsque nous traitons vos données sur la base de nos intérêts légitimes. Si vous exercez ce droit, nous cesserons d'utiliser vos informations à ces fins, sauf si nous avons des raisons légales impérieuses de continuer à les traiter.</li>
                    <li><strong>Demander la limitation du traitement de vos informations :</strong> Vous pouvez demander que nous limitions le traitement de vos données personnelles dans certaines circonstances, par exemple si vous contestez l'exactitude des données ou si vous vous opposez à leur traitement.</li>
                    <li><strong>Demander la portabilité de vos informations :</strong> Dans certains cas, vous avez le droit de recevoir les informations personnelles que vous nous avez fournies dans un format structuré, couramment utilisé et lisible par machine, et de les transmettre à un autre responsable du traitement.</li>
                    <li><strong>Retirer votre consentement :</strong> Si le traitement de vos données personnelles repose sur votre consentement (par exemple pour les communications marketing), vous avez le droit de retirer ce consentement à tout moment. Le retrait de votre consentement n'affecte pas la légalité du traitement effectué avant ce retrait.</li>
                </ul>
                <p>Pour exercer ces droits, vous pouvez nous contacter directement via les informations de contact fournies dans cette politique de confidentialité. Nous nous efforcerons de répondre à votre demande dans les plus brefs délais et, en tout état de cause, dans un délai d'un mois à compter de la réception de votre demande. Si nécessaire, ce délai peut être prolongé de deux mois supplémentaires, en fonction de la complexité de la demande, et nous vous en informerons.</p>
                <p>Si vous estimez que nous avons violé vos droits en matière de protection des données, vous avez le droit de déposer une plainte auprès de l'autorité de protection des données compétente dans votre pays, comme la CNIL en France.</p>

                <h2>7. Cookies et technologies similaires</h2>
                <p>Pour améliorer votre expérience sur Supchat et analyser l'utilisation de notre application, nous utilisons des cookies et d'autres technologies similaires. Ces technologies nous aident à personnaliser votre expérience, à vous offrir des fonctionnalités spécifiques et à améliorer la performance de l'application. Elles nous permettent également de mieux comprendre la façon dont vous utilisez notre service, afin d'en améliorer la qualité.</p>
                <p>Un <strong>cookie</strong> est un petit fichier texte qui est stocké sur votre appareil (ordinateur, smartphone, etc.) lorsque vous visitez notre site ou utilisez notre application. Il peut contenir des informations telles que votre identifiant utilisateur, vos préférences, ou des informations relatives à votre activité sur notre application. En plus des cookies, nous pouvons utiliser des technologies similaires telles que les balises web, les pixels invisibles et les scripts qui aident à collecter des informations sur l'interaction des utilisateurs avec nos services.</p>
                <p>Les cookies que nous utilisons peuvent être classés comme suit :</p>
                <ul>
                    <li><strong>Cookies nécessaires :</strong> Ces cookies sont essentiels au bon fonctionnement de notre application. Ils permettent de vous connecter, d'assurer la sécurité de vos sessions et d'exécuter des fonctions de base. Sans ces cookies, certains services ne peuvent pas être fournis.</li>
                    <li><strong>Cookies de performance :</strong> Ces cookies nous permettent de collecter des informations sur la manière dont vous utilisez notre application, par exemple les pages que vous consultez et les erreurs éventuelles que vous pourriez rencontrer. Ces informations nous aident à améliorer la performance de notre service.</li>
                    <li><strong>Cookies fonctionnels :</strong> Ces cookies nous aident à mémoriser vos préférences, telles que la langue ou la région dans laquelle vous vous trouvez, afin de personnaliser votre expérience d'utilisation. Ils permettent également de vous offrir des fonctionnalités améliorées.</li>
                    <li><strong>Cookies de ciblage et publicitaires :</strong> Ces cookies sont utilisés pour vous proposer des publicités adaptées à vos centres d'intérêt. Ils peuvent également être utilisés pour limiter le nombre de fois où vous voyez une publicité ou pour mesurer l'efficacité de la publicité diffusée.</li>
                </ul>
                <p>Vous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur. La plupart des navigateurs vous permettent de bloquer ou de supprimer les cookies, ou de configurer une alerte lorsqu'un cookie est placé sur votre appareil. Si vous choisissez de désactiver certains cookies, cela pourrait affecter certaines fonctionnalités de notre application et réduire l'efficacité de votre expérience utilisateur.</p>
                <p>Nous nous engageons à respecter votre vie privée et à ne collecter des informations via des cookies que dans le respect des législations en vigueur. Si vous avez des questions ou des préoccupations concernant l'utilisation des cookies, n'hésitez pas à nous contacter.</p>

                <h2>8. Modifications de cette politique de confidentialité</h2>
                <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment, afin de refléter les évolutions légales, techniques ou commerciales. Toute modification sera publiée sur cette page, et si les changements sont significatifs, nous nous engageons à vous en informer par le biais de notifications dans notre application ou par e-mail, en fonction de la nature de la modification.</p>
                <p>Nous vous encourageons à consulter régulièrement cette politique de confidentialité pour être informé de la manière dont nous protégeons vos informations. Les modifications seront appliquées à partir de la date de publication sur cette page, sauf indication contraire. Votre utilisation continue de notre application après la publication de la version mise à jour de la politique de confidentialité constitue votre acceptation des modifications apportées.</p>
                <p>Si vous avez des questions ou des préoccupations concernant les modifications apportées à cette politique, n'hésitez pas à nous contacter. Nous restons engagés à assurer la transparence et à protéger vos informations personnelles conformément à la loi.</p>

                <h2>9. Contactez-nous</h2>
                <p>Si vous avez des questions concernant cette politique de confidentialité ou la manière dont nous traitons vos informations personnelles, veuillez nous contacter à l'adresse suivante : <a href="mailto:support@supchat.com">support@supchat.com</a>.</p>

                <hr />
                <p>&copy; 2025 Supchat. Tous droits réservés.</p>
            </div>
        </div>
    );
};

export default PrivacyPage;