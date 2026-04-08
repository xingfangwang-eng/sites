import SolutionsClient from './SolutionsClient';
import keywordsData from '../../../data/keywords.json';

export default function SolutionsPage() {
  return <SolutionsClient keywords={keywordsData} />;
}
