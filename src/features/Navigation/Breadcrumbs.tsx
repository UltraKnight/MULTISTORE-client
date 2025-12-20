// Breadcrumbs.jsx
import { Link, useLocation, useParams } from 'react-router-dom';
import type { Category } from 'src/types/category';

export default function Breadcrumbs({ categories }: { categories?: Category[] }) {
  const { pathname } = useLocation();
  const params = useParams();

  const ignoredSegments = new Set(['by-category']);
  const categoryMap = new Map(categories?.map((cat) => [cat._id, cat.name]) ?? []);
  const rawSegments = pathname.split('/').filter(Boolean);
  const segmentsToShow = rawSegments
    .filter((seg) => !ignoredSegments.has(seg)) // remove ignored
    .map((seg) => {
      const result = categoryMap.get(seg) || seg; // replace category IDs with names
      const capitalizedSeg = result.charAt(0).toUpperCase() + result.slice(1);
      return capitalizedSeg;
    })
    .filter((seg) => !Object.values(params).includes(seg)); // remove params

  const crumbs = segmentsToShow.map((seg, index) => {
    const path = '/' + rawSegments.slice(0, index + 1).join('/');
    return { label: seg, path };
  });

  return (
    <nav aria-label='breadcrumb' className='m-3'>
      <ol className='breadcrumb'>
        {/* Home link */}
        <li className='breadcrumb-item'>
          <Link to='/'>Home</Link>
        </li>

        {/* Dynamic crumbs */}
        {crumbs.map((crumb, i) =>
          i === crumbs.length - 1 ? (
            <li key={crumb.path} className='breadcrumb-item active' aria-current='page'>
              {crumb.label}
            </li>
          ) : (
            <li key={crumb.path} className='breadcrumb-item'>
              <Link to={crumb.path}>{crumb.label}</Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
