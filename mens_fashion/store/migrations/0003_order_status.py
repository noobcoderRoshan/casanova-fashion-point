from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_add_order_session_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('placed', 'Placed'), ('cancelled', 'Cancelled')], default='placed', max_length=20),
        ),
    ]
