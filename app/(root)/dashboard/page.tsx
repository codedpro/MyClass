"use client"

import React from 'react'; 
import { Button } from 'primereact/button';

import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function BasicDemo() {
    return (
        <div className="card flex justify-content-center">
            <Button label="Check" icon="pi pi-check" />
        </div>
    )
}
        