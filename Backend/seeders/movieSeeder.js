// seeders/movieSeeder.js
import sequelize from '../utils/db.js';
import Movie from '../models/movies.model.js';

const movies = [
  {
    title: "ខ្មោចត្រឡោកបែកអ្នកបូជាសពប៉ះនាងព្រាយជើងល្អ",
    image: "/images/HO00001572.jpg",
    price: 10.00,
    days: "Playing: Monday, Wednesday, Friday",
    promotion: "Promotion: Buy 1 Get 1 Free on Monday"
  },
  {
    title: "ILLUMINATION'S DESPICABLE ME4",
    image: "/images/HO00001615.jpg",
    price: 12.00,
    days: "Playing: Tuesday, Thursday, Saturday",
    promotion: "Promotion: 20% Off for Students"
  },
  {
    title: "ការណាត់ជួបជាមួយ ប៉ុលពត",
    image: "/images/HO00001714.jpg",
    price: 15.00,
    days: "Playing: Wednesday, Friday, Sunday",
    promotion: "Promotion: Free Popcorn with Every Ticket"
  },
   {
     
      image: "/images/HO00001554.jpg",
      title: "DEADPOOL WOLVERINE",
      price: 8.00,
      days: "Playing: Monday, Thursday, Saturday",
      promotion: "Promotion: $2 Off on Online Booking"
    },
      {
   
      image: "/images/HO00001704.jpg",
      title: "អណ្តូងបណ្តាសា",
      price: 5.00,
      days: "Playing: Monday, Thursday, Saturday",
      promotion: "Promotion: $2 Off on Online Booking"
    },
      {
    
      image: "/images/HO00001705.jpg",
      title: "រត់គេចពីនរក",
      price: 12.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
    },
      {

      image: "/images/HO00001700.jpg",
      title: "ស្នេហ៍ជាងភពយ៉ូរ៉ានើស",
      price: 12.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
    },
      {
 
      image: "/images/HO00001690.jpg",
      title: "ខ្លាឃ្មុំសុីមនុស្ស",
      price: 12.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
    },
      {
   
      image: "/images/HO00001553.jpg",
      title: "INSDIE OUT2",
      price: 12.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
    },
      {
     
      image: "/images/HO00001688.jpg",
      title: "តំណាលបន្តោងគុជថ្ម",
      price: 8.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
    },
      {
    
      image: "/images/HO00001836.jpg",
      title: "Snow White",
      price: 8.00,
      days: "Playing:Thursday, Saturday,Sunday",
      promotion: "Promotion: $2 Off on Online Booking"

    },
    {
    
      image: "/images/HO00001842.jpg",
      title: "Flat Girls",
      price: 9.99,
      days: "Playing:Thursday, Saturday,Sunday",
      promotion: "Promotion: $2 Off on Online Booking"
    
    },
    {
     
      image: "/images/HO00001857.jpg",
      title: "វិញ្ញាណនិស្សិតពេទ្យ",
      price: 10.00,
      days: "Playing:Monday, Tuesday, Wednesday, Thursday, Friday",
      promotion: "Promotion: 20% Off for Students"

    
    },
    {
    
      image: "/images/HO00001864.jpg",
      title: "ណាចា",
      price: 12.00,
      days: "Playing: Saturday, Sunday",
      promotion: "Promotion: 20% Off for Students"
    },
    {
    
      image: "/images/HO00001866.jpg",
      title: "ចំណងនិស្ស័យ​ នាគរាជ",
      price: 12.00,
      days: "Playing: Tuesday, Thursday, Saturday",
      promotion: "Promotion: 20% Off for Students"
      


    }
 
];

// const seedMovies = async () => {
//   try {
//     await sequelize.sync(); // ensure table exists
//     await Movie.bulkCreate(movies);
//     console.log('Movies seeded successfully!');
//     process.exit();
//   } catch (error) {
//     console.error('Failed to seed movies:', error);
//     process.exit(1);
//   }
// };

// seedMovies();
const seedMovies = async () => {
  try {
    await sequelize.sync(); // ensure table exists

    for (const movie of movies) {
      const exists = await Movie.findOne({ where: { title: movie.title } });
      if (!exists) {
        await Movie.create(movie);
        console.log(`Added movie: ${movie.title}`);
      } else {
        console.log(`Skipped (already exists): ${movie.title}`);
      }
    }

    console.log('🎬 Movie seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed movies:', error);
    process.exit(1);
  }
};

// seedMovies();
export { seedMovies };