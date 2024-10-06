import { createGlobalState } from "react-use";

type Cart = Record<number, bigint>;

const useGlobalState = createGlobalState<Cart>({});

export function useCart() {
  const [cart, setCart] = useGlobalState();
  return {
    cart,
    reset: () => setCart({}),
    toggle: (id: number, amount: bigint) =>
      setCart({ ...cart, [id]: cart[id] ? 0n : amount }),
  };
}
