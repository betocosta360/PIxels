
  const translations = {
    en: {
      categories: {
        backgrounds: "Backgrounds",
        fashion: "Fashion",
        nature: "Nature",
        science: "Science",
        education: "Education",
        feelings: "Feelings",
        health: "Health",
        people: "People",
        religion: "Religion",
        places: "Places",
        animals: "Animals",
        industry: "Industry",
        computer: "Computer",
        food: "Food",
        sports: "Sports",
        transportation: "Transportation",
        travel: "Travel",
        buildings: "Buildings",
        business: "Business",
        music: "Music"
      },
      filters: {
        order: ["Popular", "Latest"],
        orientation: ["Horizontal", "Vertical"],
        type: ["Photo", "Illustration", "Vector"],
        colors: ["Red", "Green", "Orange", "Yellow", "Turquoise", "Blue", "Purple", "Pink", "Gray", "Black", "White", "Brown"]
      }
    },
    pt: {
      categories: {
        backgrounds: "Fundos",
        fashion: "Moda",
        nature: "Natureza",
        science: "Ciência",
        education: "Educação",
        feelings: "Sentimentos",
        health: "Saúde",
        people: "Pessoas",
        religion: "Religião",
        places: "Lugares",
        animals: "Animais",
        industry: "Indústria",
        computer: "Computador",
        food: "Comida",
        sports: "Esportes",
        transportation: "Transporte",
        travel: "Viagem",
        buildings: "Edifícios",
        business: "Negócios",
        music: "Música"
      },
      filters: {
        order: ["Popular", "Mais Recente"],
        orientation: ["Horizontal", "Vertical"],
        type: ["Foto", "Ilustração", "Vetorial"],
        colors:["red", "green", "orange", "yellow", "turquoise", "blue", "purple", "pink", "gray", "black", "white", "brown"],
  }
      }
    }
  
  
  // Defina o idioma atual (pode ser dinâmico, dependendo da lógica do seu aplicativo)
  const currentLanguage = 'pt'; // ou 'en'
  
  // Crie as categorias traduzidas
  const categories = Object.keys(translations[currentLanguage].categories).map(key => translations[currentLanguage].categories[key]);
  
  // Crie os filtros traduzidos
  const filters = {
    order: translations[currentLanguage].filters.order,
    orientation: translations[currentLanguage].filters.orientation,
    type: translations[currentLanguage].filters.type,
    colors: translations[currentLanguage].filters.colors,
  };
  
  // Exporte os dados
  export const data = {
    categories,
    filters
  };
  
  
  