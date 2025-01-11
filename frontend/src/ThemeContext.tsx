import React, { createContext, useState } from 'react'
//  this is basic interface here 
interface Theme {
    theme: string
    toggleTheme: (input: boolean) => void
}
// basic interface is done here 
const themePreference = localStorage.getItem('theme');
let userThemePreference = themePreference ? themePreference : 'dark';
if (userThemePreference === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
// basic preference is done 
 export const ThemeContext = createContext<Theme>({
    theme: userThemePreference,
    toggleTheme: (input: boolean) => {
        console.log(input);
    }
});
// default context bana dia
export const ThemeProvider = ({ children }: any) => {
    const [data, setTheme] = useState('dark');

    function toggleTheme(checked: boolean) {
        console.log("Toggled the theme here", checked);
        
        if (checked) {
            document.documentElement.classList.add('dark');
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
            localStorage.setItem('theme', 'light');
        }
    }

    return <ThemeContext.Provider value={{ theme: data, toggleTheme: toggleTheme }} >{children}</ThemeContext.Provider>
}

