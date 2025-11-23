import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { products } from './drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

const imageUpdates = [
  { name: 'Le Poulet', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/XkFJuXKCVOKIOVAn.jpg' },
  { name: 'Le Smoked Meat', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/sUHfGLKLgurntLkx.jpg' },
  { name: 'Le Végétarien', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/GLXQumOimvoRJEeY.jpg' },
  { name: 'Salade César', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/uGVMQcwPJUfiLwYs.jpg' },
  { name: 'Café', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/qThNujZUXiINjNfp.jpg' },
  { name: "Jus d'Orange", url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/KhxfYSjESGPDRCou.jpg' },
  { name: 'Thé Glacé Maison', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030752959/AghmOnRJGuaLjOrG.jpg' }
];

for (const update of imageUpdates) {
  await db.update(products)
    .set({ image: update.url })
    .where(eq(products.name, update.name));
  console.log(`Updated ${update.name}`);
}

console.log('All images updated successfully!');
process.exit(0);
