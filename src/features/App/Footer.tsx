import { FaGithubSquare, FaInfoCircle } from 'react-icons/fa';
import { IoIosContact } from 'react-icons/io';

export default function Footer() {
  const year = new Date().getFullYear();

  return year ? (
    <footer className='text-light container-fluid bg-warning'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4 py-5'>
            <div className='mb-1 d-flex flex-column align-items-center'>
              <a href='https://github.com/UltraKnight'>About me</a>
              <h1>
                <FaInfoCircle />
              </h1>
            </div>
          </div>
          <div className='col-md-4 py-5'>
            <div className='mb-1 d-flex flex-column align-items-center'>
              <a href='https://github.com/UltraKnight'>Contact</a>
              <h1>
                <IoIosContact />
              </h1>
            </div>
          </div>
          <div className='col-md-4 py-5'>
            <div className='mb-1 d-flex flex-column align-items-center'>
              <a target='_blank' rel='noreferrer' href='https://github.com/UltraKnight'>
                Github
              </a>
              <h1>
                <FaGithubSquare />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className='footer-copyright text-center py-3'>
        &copy; <span id='currentYear'>{year}</span> Copyright:
        <span>Vanderlei I. Martins</span>
      </div>
    </footer>
  ) : null;
}
