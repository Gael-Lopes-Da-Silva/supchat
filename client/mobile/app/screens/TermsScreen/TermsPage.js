import { useState } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import styles from './TermsPageStyles';
import { useRouter } from 'expo-router';

const TermsPage = () => {
  const [theme] = useState('light');
  const router = useRouter();

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <View style={styles.termsContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.termsBox}>
            <Text style={styles.title}>Conditions d'utilisation de Supchat</Text>
            <Text style={styles.line}>───────────────────────</Text>
            <Text style={styles.subtitle}>Date d'entrée en vigueur : 01 Janvier 2025</Text>
            <Text style={styles.subtitle}>Dernière mise à jour : 03 janvier 2025</Text>

            <Text style={styles.section}>1. Introduction</Text>
            <Text style={styles.paragraph}>Bienvenue sur Supchat ! Ces Conditions d'utilisation ("Conditions") régissent votre utilisation du site web, des applications mobiles et des services associés de Supchat ("Services"). En utilisant nos Services, vous acceptez ces Conditions. Si vous n'êtes pas d'accord, veuillez ne pas utiliser Supchat.</Text>
            <Text style={styles.paragraph}>Supchat est une plateforme conçue pour offrir une expérience de communication simplifiée et intuitive. Nos services incluent la messagerie instantanée, le partage de fichiers, la gestion de groupes de discussion, et bien plus encore. Notre objectif est de fournir un environnement sécurisé, convivial et accessible pour les utilisateurs du monde entier.</Text>
            <Text style={styles.paragraph}>Ces Conditions d'utilisation sont essentielles pour garantir un usage équitable et conforme de nos Services. Elles expliquent vos droits et responsabilités en tant qu'utilisateur, ainsi que les nôtres en tant que fournisseur de services. Nous vous encourageons à lire attentivement ces Conditions pour comprendre les règles qui encadrent votre expérience sur Supchat.</Text>
            <Text style={styles.paragraph}>
              En utilisant Supchat, vous acceptez également notre
              <Text style={styles.link} onPress={() => router.replace('/screens/privacy')}> Politique de confidentialité</Text>, qui décrit comment nous collectons, utilisons et protégeons vos données personnelles.
            </Text>

            <Text style={styles.section}>2. Admissibilité</Text>
            <Text style={styles.paragraph}>Vous devez avoir au moins 13 ans pour utiliser Supchat. En utilisant nos Services, vous confirmez que vous remplissez cette condition d'âge. Si vous avez entre 13 et 18 ans, vous devez obtenir l'autorisation d'un parent ou d'un tuteur légal pour utiliser nos Services. Supchat se réserve le droit de demander une preuve de cette autorisation à tout moment.</Text>
            <Text style={styles.paragraph}>L'utilisation des Services est interdite dans les juridictions où ils seraient en violation des lois locales ou nationales. En utilisant Supchat, vous déclarez que votre accès et votre utilisation des Services respectent les lois en vigueur dans votre région.</Text>

            <Text style={styles.section}>3. Votre compte</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Responsabilité :</Text> Vous êtes responsable de la sécurité de votre compte et des activités effectuées via celui-ci. Cela inclut l'utilisation de mots de passe sécurisés et la protection de vos identifiants contre tout accès non autorisé. Si vous suspectez une activité suspecte ou une faille de sécurité, vous devez nous en informer immédiatement à <Text style={{ color: '#ffbaba', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('mailto:support@supchat.com')}>support@supchat.com</Text>.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Actions interdites :</Text> Ne partagez pas vos identifiants de compte et n'utilisez pas le compte d'un autre utilisateur sans autorisation. Toute tentative de contourner les systèmes de sécurité ou d'accéder à des comptes non autorisés est strictement interdite et peut entraîner la suspension ou la résiliation de votre compte.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Vérification :</Text> Supchat peut, à sa discrétion, demander une vérification de votre identité pour confirmer la propriété du compte, notamment en cas de suspicion d'activité frauduleuse ou de conflit lié à un compte.</Text>

            <Text style={styles.section}>4. Utilisation acceptable</Text>
            <Text style={styles.paragraph}>Vous acceptez de ne pas utiliser Supchat à des fins illégales ou nuisibles. Vous vous engagez à :</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Respecter les autres utilisateurs :</Text> Ne pas harceler, menacer, diffamer ou discriminer d'autres utilisateurs en fonction de leur race, origine, sexe, orientation sexuelle, religion ou tout autre facteur protégé par la loi.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Préserver l'intégrité de la plateforme :</Text> Ne pas distribuer de spams, logiciels malveillants, virus ou tout contenu qui pourrait compromettre la sécurité de Supchat ou de ses utilisateurs.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Respecter les lois :</Text> Ne pas violer les lois ou règlements applicables, y compris ceux relatifs à la propriété intellectuelle, à la protection des données et à la confidentialité.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Utilisation équitable :</Text> Ne pas exploiter les Services de manière excessive ou abusive, ce qui pourrait affecter l'expérience des autres utilisateurs.</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Contenu approprié :</Text> Ne pas publier ou partager de contenu illégal, obscène, incitant à la violence ou portant atteinte aux droits d'autrui.</Text>
            <Text style={styles.paragraph}>En cas de violation des règles ci-dessus, Supchat se réserve le droit de suspendre ou de résilier votre accès aux Services, conformément à la section sur la résiliation.</Text>

            <Text style={styles.section}>5. Propriété du contenu</Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Votre contenu :</Text> Vous conservez la propriété du contenu que vous créez ou partagez. En publiant du contenu sur Supchat, vous nous accordez une licence non exclusive, mondiale, gratuite et transférable pour utiliser, afficher, modifier, adapter, et distribuer ce contenu, uniquement dans le but de fournir et d'améliorer nos Services. Vous garantissez que vous possédez tous les droits nécessaires pour accorder cette licence.</Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Contenu interdit :</Text> il est strictement interdit de télécharger, publier ou partager des contenus qui :
            </Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>
              ◦ Violent les droits d'auteur, marques déposées ou autres droits de propriété intellectuelle d'autrui.
            </Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>
              ◦ Sont illégaux, nuisibles, diffamatoires, obscènes ou incitent à la violence.
            </Text>
            <Text style={[styles.paragraph, { marginLeft: 20 }]}>
              ◦ Contiennent des logiciels malveillants, virus ou tout autre élément nuisible.
            </Text>
            <Text style={styles.paragraph}>• <Text style={styles.bold}>Responsabilité :</Text> Vous êtes seul responsable du contenu que vous publiez sur Supchat. Supchat se réserve le droit de supprimer tout contenu qui viole ces règles ou de suspendre les comptes associés.</Text>

            <Text style={styles.section}>6. Résiliation</Text>
            <Text style={styles.paragraph}>Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment et sans préavis si vous enfreignez ces Conditions d'utilisation ou toute autre politique applicable. Cela peut inclure, mais sans s'y limiter, des violations des règles de comportement, des activités frauduleuses, ou toute action nuisible à la sécurité ou au bon fonctionnement de nos services. En cas de résiliation, vous pourriez perdre l'accès à votre compte et à tout contenu ou service associé. Si une résiliation est effectuée pour une cause légitime, nous ne serons pas tenus responsables des pertes ou dommages que vous pourriez subir.</Text>

            <Text style={styles.section}>7. Limitation de responsabilité</Text>
            <Text style={styles.paragraph}>Supchat est fourni "en l'état", sans garanties expresse ou implicite de quelque nature que ce soit, y compris, mais sans s'y limiter, les garanties de qualité marchande, d'adéquation à un usage particulier ou de non-violation. Nous ne serons en aucun cas responsables des dommages directs, indirects, spéciaux, accessoires ou consécutifs résultant de votre utilisation ou de votre incapacité à utiliser les Services, y compris, mais sans s'y limiter, les pertes de données, les interruptions de service ou les pertes de profits. Vous reconnaissez et acceptez que l'utilisation des Services se fait à vos risques et périls.</Text>

            <Text style={styles.section}>8. Modifications des Conditions</Text>
            <Text style={styles.paragraph}>Nous nous réservons le droit de modifier, d'ajouter ou de supprimer des parties de ces Conditions à tout moment et sans préavis. Toute modification sera effective dès sa publication sur notre site ou dans l'application. Il est de votre responsabilité de consulter régulièrement ces Conditions afin de prendre connaissance des éventuelles mises à jour. Votre utilisation continue de Supchat après la publication de modifications constitue votre acceptation des nouvelles Conditions. Si vous n'acceptez pas les modifications, vous devez cesser d'utiliser les Services.</Text>

            <Text style={styles.section}>9. Contactez-nous</Text>
            <Text style={styles.paragraph}>Si vous avez des questions, des préoccupations ou des commentaires concernant ces Conditions ou nos Services, n'hésitez pas à nous contacter. Vous pouvez nous joindre par e-mail à <Text style={styles.link} onPress={() => Linking.openURL("mailto:support@supchat.com")}>support@supchat.com</Text>. Nous nous efforcerons de répondre à votre demande dans les plus brefs délais. Pour des questions urgentes, nous vous recommandons d'indiquer clairement l'urgence dans l'objet de votre e-mail.</Text>

            <Text style={styles.line}>───────────────────────</Text>
            <Text style={styles.footer}>© 2025 Supchat. Tous droits réservés.</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TermsPage;