import { useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Login:", {
      email,
      senha,
      manterConectado,
    });

    alert("Login enviado");
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brandPanel}>
          <div className={styles.brandIcon}>
            <PawPrint size={34} />
          </div>

          <div className={styles.brandText}>
            <h1 className={styles.brandTitle}>Doguinhos da UFAL</h1>
          </div>

          <Link to="/" className={styles.backLinkDesktop}>
            Voltar para a página pública
          </Link>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <span className={styles.formTag}>Área administrativa</span>
            <h2 className={styles.formTitle}>Entrar</h2>
            <p className={styles.formSubtitle}>
              Informe seu e-mail e senha para continuar.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="senha" className={styles.label}>
                Senha
              </label>
              <input
                id="senha"
                type="password"
                className={styles.input}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={manterConectado}
                onChange={(event) => setManterConectado(event.target.checked)}
              />
              <span>Manter conectado</span>
            </label>

            <button type="submit" className={styles.button}>
              Entrar
            </button>
          </form>

          <div className={styles.footer}>
            <Link to="/" className={styles.backLinkMobile}>
              Voltar para a página pública
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}