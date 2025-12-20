import { Link } from 'react-router-dom';
import type { User } from 'src/types/user';

type FinishProps = {
  step: number;
  user: User;
  status: string;
};

export default function Finish({ step, user, status }: FinishProps) {
  return user._id && step === 4 ? (
    <div className='text-center mt-3'>
      {status === 'Confirmed' ? (
        <h2>Thank you for your purchase!</h2>
      ) : (
        <h2>
          Unfortunately your payment wasn't finished... please go to your dashboard and try to pay your order again.
        </h2>
      )}
      <Link to='/dashboard' className='btn btn-primary'>
        Go to my dashboard
      </Link>
    </div>
  ) : null;
}
