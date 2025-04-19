public class Polynome {

    // 1°) Structure pour représenter un polynôme par une liste chaînée
    static class Terme {
        int coef;
        int expo;
        Terme suivant;

        Terme(int coef, int expo) {
            this.coef = coef;
            this.expo = expo;
            this.suivant = null;
        }
    }

    Terme tete = null;

    // Ajouter un terme en gardant les exposants triés (ordre décroissant)
    public void ajouterTerme(int coef, int expo) {
        if (coef == 0) return;

        Terme nouveau = new Terme(coef, expo);

        if (tete == null || expo > tete.expo) {
            nouveau.suivant = tete;
            tete = nouveau;
        } else {
            Terme courant = tete;
            while (courant.suivant != null && courant.suivant.expo > expo) {
                courant = courant.suivant;
            }
            nouveau.suivant = courant.suivant;
            courant.suivant = nouveau;
        }
    }

    // Affichage clair du polynôme
    public void afficher() {
        Terme courant = tete;
        boolean premier = true;

        while (courant != null) {
            if (!premier) System.out.print(" + ");
            if (courant.expo == 0) {
                System.out.print(courant.coef);
            } else if (courant.expo == 1) {
                System.out.print(courant.coef + "x");
            } else {
                System.out.print(courant.coef + "x^" + courant.expo);
            }
            courant = courant.suivant;
            premier = false;
        }
        System.out.println();
    }

    // 2°) Fonction DERIVEE(P)
    public Polynome derivee() {
        Polynome d = new Polynome();
        Terme courant = tete;

        while (courant != null) {
            if (courant.expo != 0) {
                int newCoef = courant.coef * courant.expo;
                int newExpo = courant.expo - 1;
                d.ajouterTerme(newCoef, newExpo);
            }
            courant = courant.suivant;
        }

        return d;
    }

    // 3°) Fonction DERIVEEKIEME(P, k)
    public Polynome deriveeKiem(int k) {
        Polynome resultat = this;
        for (int i = 0; i < k; i++) {
            resultat = resultat.derivee();
            if (resultat.tete == null) break;
        }
        return resultat;
    }

    // Programme principal pour test
    public static void main(String[] args) {
        Polynome P = new Polynome();

        // P(x) = 3x^3 + 2x^2 + 5
        P.ajouterTerme(5, 0);
        P.ajouterTerme(2, 2);
        P.ajouterTerme(3, 3);

        System.out.print("P(x) = ");
        P.afficher();

        Polynome P1 = P.derivee();
        System.out.print("P'(x) = ");
        P1.afficher();

        Polynome P2 = P.deriveeKiem(2);
        System.out.print("P''(x) = ");
        P2.afficher();
    }
}
