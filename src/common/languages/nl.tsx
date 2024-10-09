const translations  = {
  // ALT text for DALI Logo
  daliLogoAlt: 'DALI Logo',

  common: {
    welcome: 'Dali',
    currentLanguage: 'De huidige taal is: {{lang}}',
    switchLanguage: 'Wissel van taal',
  },

  commonAdmin: {
    users: {
      add: 'Toevoegen',
      edit: 'Wijzigen',
      delete: 'Verwijderen',
      user: 'Gebruiker',
      name: 'Naam',
      rollen: 'Roles',
      popup: {
        titleAdd: 'Nieuwe gebruiker toevoegen',
        userName: 'Gebruikersnaam',
        email: 'Email',
        password: 'Wachtwoord',
        confirmPassword: 'Bevestig wachtwoord',
      },
    },
  },

  commonAriaLabels: {
    togglePasswordVisibility: 'verander zichtbaarheid wachtwoord'
  },

  // Error messages
  error: {
    alertTitle: 'Foutmelding',
    loginFailed: 'Inloggen mislukt',
    endTime: 'Eindtijd mag niet voor Begintijd liggen',
    noResponse: 'Geen reactie van de server',
    unauthorized: 'Gebruikersnaam of wachtwoord onjuist',
    usernamePasswordMissing: 'Gebruikersnaam of wachtwoord ontbreekt',
    serverError: 'Er is een fout opgetreden op de server. Neem contact op met DALI support als de fout zich blijft voordoen.',
  },

  // Login-related translations
  login: {
    forgotPassword: 'Wachtwoord vergeten?',
    loginButton: 'Aanmelden',
    rememberMeLabel: 'Ingelogd blijven',
  },


  // Contact DALI Helpdesk translation
  mailToDaliHelpdesk: 'Mail naar DALI-Helpdesk',

  // Menu translations
  menu: {
    settings: 'Instellingen',
    logout: 'Uitloggen',
  },

  // Translations for the error page scenario
  errorPage: {
    header: 'Oeps!',
    text: 'Er is een fout opgetreden',
    visitHomepage: 'Bezoek onze homepage',
  },

  // Translations for the missing page scenario
  missingPage: {
    header: 'Oeps!',
    text: 'Pagina niet gevonden',
    visitHomepage: 'Bezoek onze homepage',
  },

  // Password-related translation
  password: 'Wachtwoord',

  // Persist login loading translation
  persistLogin: {
    loading: 'Laden...'
  },

  // Unauthorized page translation
  unAuthorized: {
    title: 'Ongeautoriseerd',
    message: 'U heeft geen toegang tot de gevraagde pagina.',
    goBack: 'Ga terug',
    logout: 'Uitloggen',
  },

  // Translations for the edit page
  editPage: {
    add: "Toevoegen",
    actions: "Acties",
    employeesHeader: "Medewerkerslijst",
    employeeEntity: "medewerker",
    carsHeader: "Autolijst",
    carEntity: "auto",
    materialsHeader: "Materialenlijst",
    materialEntity: "materiaal",
    accountsEntity: "Accounts",
    userName: "Gebruikersnaam",
    name: "Naam",
    roles: "Rollen"
  },

  // Username translation
  userName: 'Gebruikersnaam'
};

export default translations ;