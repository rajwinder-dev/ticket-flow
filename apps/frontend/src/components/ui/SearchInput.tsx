import { SearchIcon } from "./Icons";
import { Input } from "./Input";
interface props {
  placeholder?: string
}
function SearchInput({placeholder, ...props}: props) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        className="rounded-md pl-9 py-2 h-12 "
        {...props}
      />
      <div className="absolute top-4 left-3 scale-115">
        <SearchIcon />
      </div>
    </div>
  );
}

export default SearchInput;
