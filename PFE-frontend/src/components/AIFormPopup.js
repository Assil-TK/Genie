import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';




const steps = [
    'objectif',
    'layout',
    'theme',
    'composants',
    'style',
    'framework',
];

const AIFormPopup = ({ onPromptReady }) => {
    const steps = ['objectif', 'layout', 'theme', 'composants', 'style', 'framework'];
    const [showForm, setShowForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        objectif: '',
        layout: '',
        theme: '',
        themeCustom: '',
        composants: [],
        style: '',
        framework: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                composants: checked
                    ? [...prev.composants, value]
                    : prev.composants.filter((item) => item !== value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prompt = `Créer une page avec comme objectif : ${formData.objectif}.
Disposition : ${formData.layout}, thème : ${formData.theme}${formData.theme === 'Personnalisé' ? ` (${formData.themeCustom})` : ''}.
Composants à inclure : ${formData.composants.join(', ')}.
Style visuel : ${formData.style}, framework ou librairie : ${formData.framework}.`;
        onPromptReady(prompt);
        setShowForm(false);
        setCurrentStep(0);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    const renderStep = () => {
        switch (steps[currentStep]) {
            case 'objectif':
                return (
                    <div>
                        <strong>Que doit faire ou contenir cette page ?</strong>
                        <textarea
                            name="objectif"
                            placeholder="Ex: Afficher les produits, formulaire de contact..."
                            rows="3"
                            onChange={handleChange}
                            value={formData.objectif}
                            required
                            style={inputStyle}
                        />
                    </div>
                );
            case 'layout':
                return (
                    <div style={{ marginBottom: '20px' }}>
                        <strong style={{ display: 'block', marginBottom: '10px' }}>
                            Mise en page préférée :
                        </strong>

                        {['En-tête + Contenu', 'Barre latérale + Contenu', 'Grille / Cartes', 'Plein écran', 'Autre'].map((layout) => (
                            <label key={layout} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="layout"
                                    value={layout}
                                    onChange={handleChange}
                                    checked={formData.layout === layout || (layout === 'Autre' && isAutre())}
                                    style={{ marginRight: '8px' }}
                                    required
                                />
                                {layout}
                            </label>
                        ))}

                        {isAutre() && (
                            <input
                                type="text"
                                name="layout"
                                placeholder="Veuillez préciser votre mise en page"
                                value={formData.layout}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        layout: e.target.value,
                                    }))
                                }
                                style={{
                                    marginTop: '12px',
                                    padding: '10px 14px',
                                    width: '100%',
                                    maxWidth: '400px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                                    fontSize: '15px',
                                    outlineColor: '#4A90E2',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        )}
                    </div>
                );

                function isAutre() {
                    return !['En-tête + Contenu', 'Barre latérale + Contenu', 'Grille / Cartes', 'Plein écran'].includes(formData.layout);
                }

            case 'theme':
                return (
                    <div>
                        <strong>Thème de couleurs :</strong>
                        {['Clair', 'Sombre', 'Personnalisé'].map((theme) => (
                            <label key={theme} style={radioStyle}>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={theme}
                                    onChange={handleChange}
                                    checked={formData.theme === theme}
                                    required
                                />
                                {theme}
                            </label>
                        ))}
                        {formData.theme === 'Personnalisé' && (
                            <input
                                name="themeCustom"
                                placeholder="Ex: Bleu pastel, rouge foncé..."
                                onChange={handleChange}
                                value={formData.themeCustom}
                                style={inputStyle}
                            />
                        )}
                    </div>
                );
            case 'composants':
                return (
                    <div>
                        <strong>Composants à inclure :</strong>
                        {[
                            'Barre de navigation (Navbar)',
                            'Pied de page (Footer)',
                            'Boutons',
                            'Formulaire',
                            'Tableau',
                            'Galerie d’images',
                            'Cartes produits',
                            'Barre de recherche / filtres',
                            'Section de texte',
                            'Icônes',
                        ].map((item) => (
                            <label key={item} style={checkboxStyle}>
                                <input
                                    type="checkbox"
                                    name="composants"
                                    value={item}
                                    onChange={handleChange}
                                    checked={formData.composants.includes(item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                );
            case 'style':
                return (
                    <div>
                        <strong>Style visuel préféré :</strong>
                        {['Minimaliste', 'Professionnel / Corporate', 'Ludique / Amusant', 'Artistique / Créatif', 'Moderne avec animations'].map((style) => (
                            <label key={style} style={radioStyle}>
                                <input
                                    type="radio"
                                    name="style"
                                    value={style}
                                    onChange={handleChange}
                                    checked={formData.style === style}
                                    required
                                />
                                {style}
                            </label>
                        ))}
                    </div>
                );
            case 'framework':
                return (
                    <div>
                        <strong>Framework ou style préféré :</strong>
                        {['Bootstrap', 'MUI', 'Peu importe'].map((fw) => (
                            <label key={fw} style={radioStyle}>
                                <input
                                    type="radio"
                                    name="framework"
                                    value={fw}
                                    onChange={handleChange}
                                    checked={formData.framework === fw}
                                    required
                                />
                                {fw}
                            </label>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };
    const isStepValid = () => {
        switch (steps[currentStep]) {
            case 'objectif':
                return formData.objectif.trim() !== '';
            case 'layout':
                // For 'Autre', accept any non-empty string; otherwise, one of the predefined options
                return formData.layout.trim() !== '';
            case 'theme':
                if (formData.theme === '') return false;
                if (formData.theme === 'Personnalisé') {
                    return formData.themeCustom.trim() !== '';
                }
                return true;
            case 'composants':
                return formData.composants.length > 0;
            case 'style':
                return formData.style !== '';
            case 'framework':
                return formData.framework !== '';
            default:
                return false;
        }
    };

    return (
        <>
            <div
                onClick={() => setShowForm(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#facc15',
                    borderRadius: '50%',
                    padding: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                }}
                title="Génération IA"
            >
                <Sparkles />
            </div>

            {showForm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1001,
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '2rem',
                            borderRadius: '1rem',
                            width: '90%',
                            maxWidth: '600px',
                            height: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center' }}>Génération guidée par l'IA</h3>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flex: 1,
                            }}
                        >
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                                {renderStep()}
                            </div>

                            {/* Step Indicator */}
                            <div style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem', color: '#666' }}>
                                {currentStep + 1} / {steps.length}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '1rem',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        style={{
                                            ...buttonStyle,
                                            backgroundColor: currentStep === 0 ? '#ccc' : '#2196f3',
                                            cursor: currentStep === 0 ? 'default' : 'pointer',
                                        }}
                                    >
                                        Précédent
                                    </button>

                                    {currentStep < steps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!isStepValid()}
                                            style={{
                                                ...buttonStyle,
                                                backgroundColor: isStepValid() ? '#2196f3' : '#ccc',
                                                cursor: isStepValid() ? 'pointer' : 'default',
                                            }}
                                        >
                                            Suivant
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={!isStepValid()}
                                            style={{
                                                ...buttonStyle,
                                                backgroundColor: isStepValid() ? '#4caf50' : '#ccc',
                                                cursor: isStepValid() ? 'pointer' : 'default',
                                            }}
                                        >
                                            Générer
                                        </button>
                                    )}

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setCurrentStep(0);
                                        setFormData({
                                            objectif: '',
                                            layout: '',
                                            theme: '',
                                            themeCustom: '',
                                            composants: [],
                                            style: '',
                                            framework: '',
                                        });
                                    }}
                                    style={{ ...buttonStyle, backgroundColor: '#f44336' }}
                                >
                                    Annuler
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

// Styles
const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
};

const radioStyle = {
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '0.95rem',
};

const checkboxStyle = {
    display: 'block',
    marginTop: '0.3rem',
    fontSize: '0.95rem',
};

const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    color: '#fff',
    borderRadius: '6px',
    fontWeight: 'bold',
};

export default AIFormPopup;
