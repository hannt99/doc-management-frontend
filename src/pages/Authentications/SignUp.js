import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    console.log(name);
    return (
        <form>
            <div>
                <label></label>
                <input className="" value={name} placeholder="name" onChange={(e) => setName(e.target.value)} />
            </div>
        </form>
    );
};

export default SignUp;
