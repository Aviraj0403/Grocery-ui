const CategoryCard = ({ name, img, isSelected }) => (
  <div
    className={`w-[80px] flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:scale-105 ${
      isSelected ? 'text-green-700 font-semibold' : 'text-gray-700'
    }`}
    title={name}
  >
    <div className="w-[64px] h-[64px] rounded-full overflow-hidden shadow-sm mb-1 bg-gray-100">
      <img
        src={img}
        alt={name}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-[11px] truncate w-full">{name}</span>
  </div>
);

export default CategoryCard;
