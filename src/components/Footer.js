import React, { useEffect, useState } from 'react';

export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        setYear(currentYear);
    }, []);

    return year ? (
        <footer class="text-light container-fluid bg-warning">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 py-5">
                        <div class="mb-5 d-flex flex-column align-items-center">
                            <a href="#">About me</a>
                        </div>
                    </div>
                    <div class="col-md-4 py-5">
                        <div class="mb-5 d-flex flex-column align-items-center">
                            <a href="#">Contact</a>
                        </div>
                    </div>
                    <div class="col-md-4 py-5">
                        <div class="mb-5 d-flex flex-column align-items-center">
                            <a target="_blank" href="https://github.com/UltraKnight">Github</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-copyright text-center py-3">&copy; <span id="currentYear">{year}</span> Copyright:
                <span>Vanderlei I. Martins</span>
            </div>
        </footer>
    ) : null
}