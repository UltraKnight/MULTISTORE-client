import React, { useEffect, useState } from 'react';

export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear);
    }, []);

    return year ? (
        <footer className="text-light container-fluid bg-warning">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 py-5">
                        <div className="mb-5 d-flex flex-column align-items-center">
                            <a href="https://github.com/UltraKnight">About me</a>
                        </div>
                    </div>
                    <div className="col-md-4 py-5">
                        <div className="mb-5 d-flex flex-column align-items-center">
                            <a href="https://github.com/UltraKnight">Contact</a>
                        </div>
                    </div>
                    <div className="col-md-4 py-5">
                        <div className="mb-5 d-flex flex-column align-items-center">
                            <a target="_blank" rel="noreferrer" href="https://github.com/UltraKnight">Github</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-copyright text-center py-3">&copy; <span id="currentYear">{year}</span> Copyright:
                <span>Vanderlei I. Martins</span>
            </div>
        </footer>
    ) : null
}