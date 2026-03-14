const CategoryCard = ({ name, img, isSelected }) => (
  <div
    className={`min-w-[85px] sm:min-w-[100px] flex flex-col items-center text-center cursor-pointer transition-all duration-300 group ${
      isSelected ? 'scale-105' : 'hover:scale-105'
    }`}
    title={name}
  >
    <div className={`w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-2xl overflow-hidden shadow-md mb-2 bg-white flex items-center justify-center p-1 transition-all duration-300 border-2 ${
      isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-transparent group-hover:border-emerald-100'
    }`}>
      <img
        src={img}
        alt={name}
        loading="lazy"
        className="w-full h-full object-contain"
      />
    </div>
    <span className={`text-xs sm:text-sm font-bold truncate w-full transition-colors ${
      isSelected ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-600'
    }`}>
      {name}
    </span>
  </div>
);

export default CategoryCard;
