type Props = {
  params: {
    recipeId: string;
  };
};

export default function RecipePage(props: Props) {
  return <div>recipe page {props.params.recipeId}</div>;
}
