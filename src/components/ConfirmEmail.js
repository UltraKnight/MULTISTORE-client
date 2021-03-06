import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmEmail } from '../api';

export default class ConfirmEmail extends Component {
  state = {
    confirming: true
  }

  //use id generated by mongo 
  componentDidMount = async () => {
    
    const {id} = this.props.match.params;
    try {
        const response = await confirmEmail(id);

        this.setState({confirming: false});
        if(response.data.msg === 'Could not find you!') {
            toast.error(response.data.msg);
          
        } else {
            toast.success(response.data.msg);
        }
    } catch (error) {
        console.log(error);
        this.props.history.push('/login');
    }
  }

  render = () =>
    <div className='confirm text-center mt-3'>
      {this.state.confirming
        ? <h2>Veryfing email...</h2>
        : <Link to='/profile' className='btn btn-warning'>Go to your profile</Link>
      }
    </div>
}